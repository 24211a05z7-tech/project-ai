import { User } from '../models/User';
import { IUser } from '../types';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { createError } from '../middleware/errorHandler';
import { validateObjectId } from '../utils/helpers';
import { Types } from 'mongoose';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: Record<string, unknown>;
}

export async function registerUser(
  email: string,
  name: string,
  password: string,
  roles?: string[]
): Promise<AuthTokens> {
  const sanitizedEmail = String(email).toLowerCase().trim();
  const existingUser = await User.findOne({ email: sanitizedEmail });
  if (existingUser) {
    throw createError('Email already registered', 409);
  }

  const user = await User.create({
    email: sanitizedEmail,
    name: String(name).trim(),
    password,
    roles: roles || ['member'],
  });

  const payload = { userId: user._id.toString(), email: user.email, roles: user.roles };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    user: user.toJSON(),
  };
}

export async function loginUser(email: string, password: string): Promise<AuthTokens> {
  const sanitizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: sanitizedEmail }).select('+password');
  if (!user || !user.password) {
    throw createError('Invalid credentials', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError('Invalid credentials', 401);
  }

  const payload = { userId: user._id.toString(), email: user.email, roles: user.roles };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    user: user.toJSON(),
  };
}

export async function googleAuth(profile: {
  id: string;
  emails?: Array<{ value: string }>;
  displayName: string;
  photos?: Array<{ value: string }>;
}): Promise<AuthTokens> {
  const email = profile.emails?.[0]?.value;
  if (!email) throw createError('No email from Google', 400);

  let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });
  if (!user) {
    user = await User.create({
      googleId: profile.id,
      email,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value,
      roles: ['member'],
    });
  } else if (!user.googleId) {
    user.googleId = profile.id;
    if (profile.photos?.[0]?.value) user.avatar = profile.photos[0].value;
    await user.save();
  }

  const payload = { userId: user._id.toString(), email: user.email, roles: user.roles };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    user: user.toJSON(),
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw createError('Invalid or expired refresh token', 401);
  }

  const user = await User.findById(new Types.ObjectId(payload.userId));
  if (!user) throw createError('User not found', 404);

  const newPayload = { userId: user._id.toString(), email: user.email, roles: user.roles };
  return { accessToken: generateAccessToken(newPayload) };
}

export async function getProfile(userId: string): Promise<IUser> {
  validateObjectId(userId, 'userId');
  const user = await User.findById(new Types.ObjectId(userId));
  if (!user) throw createError('User not found', 404);
  return user;
}

export async function updateProfile(
  userId: string,
  updates: { name?: string; avatar?: string; preferences?: { theme?: 'light' | 'dark'; notifications?: boolean } }
): Promise<IUser> {
  validateObjectId(userId, 'userId');
  const user = await User.findByIdAndUpdate(new Types.ObjectId(userId), { $set: updates }, { new: true, runValidators: true });
  if (!user) throw createError('User not found', 404);
  return user;
}
