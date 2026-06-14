import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createStoredUser } from "@/lib/auth-store";

const accountStatusSchema = z.enum(["PENDING_VERIFICATION", "VERIFIED", "REJECTED", "SUSPENDED", "ACTIVE"]);

const studentSchema = z.object({
  flow: z.literal("student"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  dateOfBirth: z.string().min(1),
  gender: z.enum(["MALE", "FEMALE"]),
  phoneNumber: z.string().min(7),
  email: z.string().email(),
  address: z.string().min(5),
  university: z.string().min(2),
  faculty: z.string().min(2),
  course: z.string().min(1),
  studentIdNumber: z.string().optional(),
  password: z.string().min(8),
  passwordConfirmation: z.string().min(8)
});

const universityProviderSchema = z.object({
  flow: z.literal("provider-university"),
  providerType: z.literal("UNIVERSITY_ADMINISTRATION"),
  officialUniversityName: z.string().min(2),
  shortName: z.string().min(2),
  organizationType: z.string().min(2),
  officialAddress: z.string().min(5),
  contactPhoneNumber: z.string().min(7),
  officialEmailAddress: z.string().email(),
  website: z.string().optional(),
  responsiblePersonFullName: z.string().min(2),
  responsiblePersonPosition: z.string().min(2),
  responsiblePersonPhone: z.string().min(7),
  responsiblePersonEmail: z.string().email(),
  bankAccountNumber: z.string().min(8),
  organizationTaxNumber: z.string().min(5),
  paymentReceivingInformation: z.string().min(2),
  registrationCertificate: z.string().optional(),
  authorizationLetter: z.string().optional(),
  supportingDocuments: z.string().optional(),
  password: z.string().min(8),
  passwordConfirmation: z.string().min(8)
});

const privateProviderSchema = z.object({
  flow: z.literal("provider-private"),
  providerType: z.literal("PRIVATE_PROVIDER"),
  fullName: z.string().min(2),
  dateOfBirth: z.string().min(1),
  phoneNumber: z.string().min(7),
  emailAddress: z.string().email(),
  propertyType: z.string().min(2),
  region: z.string().min(2),
  district: z.string().min(2),
  address: z.string().min(5),
  oneIdVerified: z.boolean().optional(),
  password: z.string().min(8),
  passwordConfirmation: z.string().min(8)
});

const registrationSchema = z.discriminatedUnion("flow", [
  studentSchema,
  universityProviderSchema,
  privateProviderSchema
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = registrationSchema.parse(body);

    if (payload.password !== payload.passwordConfirmation) {
      return NextResponse.json({ message: "Parollar mos emas" }, { status: 400 });
    }

    if (payload.flow === "student") {
      const status = "ACTIVE" satisfies z.infer<typeof accountStatusSchema>;
      const user = await createStoredUser({
        email: payload.email,
        password: payload.password,
        displayName: `${payload.firstName} ${payload.lastName}`.trim(),
        role: "STUDENT",
        status,
        verified: false
      });

      const response = NextResponse.json(
        {
          message: "Talaba ro'yxatdan muvaffaqiyatli o'tdi",
          accountStatus: status,
          redirectTo: "/",
          verificationHint:
            "OneID orqali shaxsni tasdiqlang va Verified Student nishonini oling."
        },
        { status: 201 }
      );

      response.cookies.set(
        "talabajoy_session",
        JSON.stringify({
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          status: user.status,
          verified: user.verified
        }),
        {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7
        }
      );

      return response;
    }

    if (payload.flow === "provider-university") {
      const status = "PENDING_VERIFICATION" satisfies z.infer<typeof accountStatusSchema>;
      const user = await createStoredUser({
        email: payload.officialEmailAddress,
        password: payload.password,
        displayName: payload.shortName,
        role: "UNIVERSITY_PROVIDER",
        status,
        verified: true
      });

      const response = NextResponse.json(
        {
          message: "Universitet tashkiloti tekshiruvga yuborildi",
          accountStatus: status,
          redirectTo: "/",
          verificationHint:
            "Platforma administratorlari ma'lumotlarni ko'rib chiqqach listinglar faollashadi."
        },
        { status: 201 }
      );

      response.cookies.set(
        "talabajoy_session",
        JSON.stringify({
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          status: user.status,
          verified: user.verified
        }),
        {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7
        }
      );

      return response;
    }

    const status = "PENDING_VERIFICATION" satisfies z.infer<typeof accountStatusSchema>;
    const user = await createStoredUser({
      email: payload.emailAddress,
      password: payload.password,
      displayName: payload.fullName,
      role: "PRIVATE_PROVIDER",
      status,
      verified: false
    });

    const response = NextResponse.json(
      {
        message: "Xususiy provayder ro'yxatdan o'tdi",
        accountStatus: status,
        redirectTo: "/",
        verificationHint: "OneID va davlat tekshiruvidan o'tgach listing joylashtirish ochiladi."
      },
      { status: 201 }
    );

    response.cookies.set(
      "talabajoy_session",
      JSON.stringify({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        status: user.status,
        verified: user.verified
      }),
      {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7
      }
    );

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Forma ma'lumotlari to'liq emas",
          issues: error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: (error as Error).message || "Ro'yxatdan o'tishda xatolik" }, { status: 500 });
  }
}
