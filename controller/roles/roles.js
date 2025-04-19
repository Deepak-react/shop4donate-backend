import { createRole, getRoleById, getAllRoles, updateRoleById } from '../../prisma/model/roles/roles.js';
import { z } from 'zod';

// Define Zod schema with validation for empty role
const roleSchema = z.object({
  role: z.string().trim().min(1, { message: 'Role is required.' }) // Ensures role cannot be empty
});

// Create Role
const roles_create = async (req, res) => {
  const { role } = req.body;

  try {
    // Validate with Zod
    const validatedData = roleSchema.parse({ role });

    // Check if the role already exists in the database
    const existingRole = await createRole({
      role: validatedData.role, // Send only the role field
    });

    // Success response
    return res.status(201).json({
      message: 'Role created successfully!',
      role: existingRole,
    });
  } catch (error) {
    console.error('Role creation error:', error.message);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    // Handle unexpected errors
    return res.status(500).json({ message: error.message || 'Something went wrong!' });
  }
};

// Get Role(s)
const roles_get = async (req, res) => {
  const { id } = req.params; // Get role ID from the request params

  try {
    // If an ID is provided, return the specific role
    if (id) {
      const role = await getRoleById(id);
      if (!role) {
        return res.status(404).json({ message: `Role with ID ${id} not found.` });
      }
      return res.status(200).json(role);
    }

    // If no ID is provided, return all roles
    const roles = await getAllRoles();
    return res.status(200).json(roles);
    
  } catch (error) {
    console.error('Error fetching roles:', error.message);
    return res.status(500).json({ message: error.message || 'Something went wrong!' });
  }
};


// Put role by id
const roles_update = async (req, res) => {
  const { id } = req.params;
  const { role, is_active } = req.body;

  try {
    // Validate the input role
    const validated = roleSchema.parse({ role });

    // Use the helper function to update the role
    const updatedRole = await updateRoleById(id, validated.role, is_active);

    return res.status(200).json({
      message: `Role with ID ${id} updated successfully.`,
      role: updatedRole,
    });
  } catch (error) {
    console.error('Error updating role:', error.message);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    return res.status(500).json({ message: error.message || 'Something went wrong!' });
  }
};

export { roles_create, roles_get, roles_update };