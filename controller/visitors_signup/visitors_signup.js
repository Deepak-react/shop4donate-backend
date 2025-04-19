import { createVisitor, getVisitors, getVisitor, updateVisitorById } from '../../prisma/model/visitors_signup/visitors_signup.js';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Zod Schema
const signupSchema = z.object({
  user_name: z.string().min(1, { message: 'User name is required.' }),
  user_email: z.string().email({ message: 'Invalid email format.' }),
  password: z.string().min(8).max(20),
  contact_number: z.string().regex(/^\d+$/, { message: 'Only digits allowed' }),
  profile_image: z.string().nullable(),
  bg_image: z.string().nullable(),
  is_active: z.string().optional(),
});

// POST visitors_signup
export const visitors_signup = async (req, res) => {
  try {
    const { user_name, user_email, password, contact_number } = req.body;
    const profile_image = req.files?.profile_image?.[0]?.path || null;
    const bg_image = req.files?.bg_image?.[0]?.path || null;

    const validatedData = signupSchema.parse({
      user_name,
      user_email,
      password,
      contact_number,
      profile_image,
      bg_image,
    });

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = await createVisitor({
      ...validatedData,
      password: hashedPassword,
    });

    return res.status(201).json({ message: 'Signup successful!', user: {...newUser, password: undefined} });
    
  } catch (error) {
    console.error('Signup error:', error.message);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: error.message || 'Something went wrong!' });
  }
};

// GET - all
export const getAllVisitors = async (req, res) => {
  try {
    const users = await getVisitors();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Get all error:', error.message);
    return res.status(500).json({ message: 'Failed to get visitors' });
  }
};

// GET - by ID
export const getVisitorById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getVisitor(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json(user);
  } catch (error) {
    console.error('Get by ID error:', error.message);
    return res.status(500).json({ message: 'Failed to get visitor' });
  }
};

/// put - update visitor by id

export const updateVisitor = async (reqId,req, res) => {
  try {
    const { user_name, user_email, password, contact_number,is_active } = req.body;
    const profile_image = req.files?.profile_image?.[0]?.path || null;
    const bg_image = req.files?.bg_image?.[0]?.path || null;

    const validatedData = signupSchema.parse({
      user_name,
      user_email,
      password,
      contact_number,
      profile_image,
      bg_image,
      is_active
    });

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    const newUser = await updateVisitorById(reqId, {
      ...validatedData,
      password: hashedPassword,
    });
    return res.status(200).json({ message: 'Updated successfully',
       user: {...newUser, password: undefined} });
    
  } catch (error) {
    console.error('Signup error:', error.message);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    return res.status(500).json({ message: error.message || 'Something went wrong!' });
  }
};