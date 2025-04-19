import bcrypt from 'bcryptjs';
import prisma from '../../index.js';

// Create user
export const createVisitor = async (userData) => {
  const { user_email, password } = userData;

  const existing = await prisma.users.findUnique({ where: { user_email } });
  if (existing) throw new Error('Email already registered');

  return await prisma.users.create({ data: userData });
};

// Get all
export const getVisitors = async () => {
  const users = await prisma.users.findMany();
  return users.map(({ password, ...user }) => user);
};

// Get by ID
export const getVisitor = async (id) => {
const user = await prisma.users.findUnique({ where: { id } });
if (!user) return null;
const { password, ...safeUser } = user;
return safeUser;
};

// Update user by ID

export const updateVisitorById = async (Visiterid, req) => {
  try {
    
  const result=await prisma.users.update({
    where: { 
      id:Number(Visiterid)

     },
    data:{
      user_name: req.user_name,
      user_email: req.user_email,
      contact_number: req.contact_number,
      password:req.password,
      profile_image:req.profile_image,
      bg_image:req.bg_image,
      is_active:req.is_active=='true'?true:false,
    }
  });
  return result;
  } catch (e) {
    throw new Error(e.message);
  }
};