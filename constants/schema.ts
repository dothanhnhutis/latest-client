import { z } from "zod";

export const signinInputSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict();

export const signupInputSchema = z
  .object({
    email: z.string().email("invaid_email"),
    password: z
      .string()
      .min(8, "too_small")
      .max(40, "too_big")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
        "format_error"
      ),
    code: z.string().length(6, "length_error"),
  })
  .strict();

export const sendOTPInputSchema = z
  .object({
    email: z.string().email("invaid_email"),
    type: z.enum(["SIGNINUP", "RESETPASSWORD"] as const).optional(),
  })
  .strict();

export const createTagInputSchema = z.object({
  name: z
    .string({
      required_error: "name field is required",
      invalid_type_error: "name field must be string",
    })
    .min(1, "name field must be at least 1 character"),
  slug: z
    .string({
      required_error: "slug field is required",
      invalid_type_error: "slug field must be string",
    })
    .min(1, "slug field must be at least 1 character"),
});

export const roles = [
  "Admin",
  "Manager",
  "Accountance",
  "Researcher",
  "Paperworker",
  "Writer",
] as const;
export const roleZod = z.enum(roles);
export type Role = z.infer<typeof roleZod>;

export const userCreateInputSchema = z.object({
  email: z
    .string({
      required_error: "email field is required",
      invalid_type_error: "email field must be string",
    })
    .email("Invalid email"),
  isActive: z.boolean({
    required_error: "isActive field is required",
    invalid_type_error: "isActive field must be boolean",
  }),
  role: roleZod,
  username: z.string({
    required_error: "username field is required",
    invalid_type_error: "username field must be string",
  }),
  password: z.string({
    required_error: "password field is required",
    invalid_type_error: "password field must be string",
  }),
});

export type UserCreateInput = z.infer<typeof userCreateInputSchema>;

export const editUserSchema = z
  .object({
    email: z
      .string({
        required_error: "email field is required",
        invalid_type_error: "email field must be string",
      })
      .email("Invalid email"),
    password: z
      .string({
        required_error: "password field is required",
        invalid_type_error: "password field must be string",
      })
      .min(8, "password field is too short")
      .max(40, "password field can not be longer than 40 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
        "password field must include: letters, numbers and special characters"
      ),
    role: roleZod,
    isActive: z.boolean({
      required_error: "isActive field is required",
      invalid_type_error: "isActive field must be boolean",
    }),
    username: z.string({
      required_error: "username field is required",
      invalid_type_error: "username field must be string",
    }),
    bio: z
      .string({
        required_error: "bio field is required",
        invalid_type_error: "bio field must be string",
      })
      .max(255, "bio_length_error"),
    phone: z.string({
      required_error: "phone field is required",
      invalid_type_error: "phone field must be string",
    }),
    avatarUrl: z
      .string({
        required_error: "avatarUrl field is required",
        invalid_type_error: "avatarUrl field must be string",
      })
      .nullable(),
    address: z.string({
      required_error: "address field is required",
      invalid_type_error: "address field must be string",
    }),
  })
  .partial();
export type EditUserInput = z.infer<typeof editUserSchema>;

export type SigninInput = z.infer<typeof signinInputSchema>;
export type SignupInput = z.infer<typeof signupInputSchema>;
export type SendOTPInput = z.infer<typeof sendOTPInputSchema>;
export type CreateTagInput = z.infer<typeof createTagInputSchema>;
