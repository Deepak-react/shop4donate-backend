import prisma from '../../index.js';

// Create Role
export const createRole = async ({ role }) => {
  try {
    const existingRole = await prisma.roles.findFirst({
      where: { role }
    });

    if (existingRole) {
      throw new Error('Role already exists.');
    }

    const newRole = await prisma.roles.create({
      data: {
        role,
      }
    });

    return newRole;
  } catch (error) {
    throw new Error(error.message || 'Error creating role.');
  }
};

// Get Role By ID
export const getRoleById = async (id) => {
  try {
    const role = await prisma.roles.findUnique({
      where: { id: parseInt(id) }
    });
    return role;
  } catch (error) {
    throw new Error('Error fetching role by ID.');
  }
};

// Get All Roles
export const getAllRoles = async () => {
  try {
    const roles = await prisma.roles.findMany();
    return roles;
  } catch (error) {
    throw new Error('Error fetching all roles.');
  }
};


// PUT - Update Role by ID
export const updateRoleById = async (id, newRole, is_active = true) => {
  try {
    // Check if role exists
    const existingRole = await prisma.roles.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingRole) {
      throw new Error(`Role with ID ${id} not found.`);
    }

    // Update role
    const updatedRole = await prisma.roles.update({
      where: { id: parseInt(id) },
      data: {
        role: newRole,
        is_active: is_active === 'false' ? false : true, // Convert to boolean
        updated_at: new Date(), // Optionally update timestamp
      }
    });

    return updatedRole;
  } catch (error) {
    throw new Error(error.message || 'Error updating role.');
  }
};
