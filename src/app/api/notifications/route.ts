import { NextRequest, NextResponse } from 'next/server';

interface NotificationSettings {
  email: string;
  enabled: boolean;
  assets: string[];
}

// In-memory storage (use database in production)
let notificationSettings: NotificationSettings | null = null;

export async function GET() {
  return NextResponse.json({
    success: true,
    settings: notificationSettings
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, enabled, assets } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    notificationSettings = {
      email,
      enabled: enabled ?? true,
      assets: assets || []
    };

    // In production, you would:
    // 1. Save to database
    // 2. Set up email verification
    // 3. Configure notification service (SendGrid, AWS SES, etc.)
    // 4. Set up news monitoring and alert triggers

    return NextResponse.json({
      success: true,
      message: 'Notification settings saved',
      settings: notificationSettings
    });
  } catch (error) {
    console.error('Error saving notification settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
