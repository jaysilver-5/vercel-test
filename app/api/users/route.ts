// /app/api/users/route.ts
import { NextResponse } from 'next/server';
import { auth } from '../../../lib/firebaseAdmin';

type UserRecord = {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pageToken = url.searchParams.get('pageToken') || undefined;
  const pageSize = parseInt(url.searchParams.get('pageSize') || '1000', 10);

  try {
    const result = await auth.listUsers(pageSize, pageToken);
    const users = result.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    }));

    return NextResponse.json(
      {
        users,
        nextPageToken: result.pageToken || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
