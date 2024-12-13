import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Helper function to parse cookies from a request
function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [key, value] = cookie.split('=').map(c => c.trim());
    if (key && value) {
      cookies[key] = decodeURIComponent(value);
    }
    return cookies;
  }, {} as Record<string, string>);
}

// Function to verify the JWT token from the request
export function verifyTokenFromRequest(request: Request) {
  // First, check the Authorization header
  const authorizationHeader = request.headers.get('Authorization');
  let token: string | undefined;

  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    token = authorizationHeader.slice(7); // Extract the token part after "Bearer "
  } else {
    // If not in header, check cookies
    const cookieHeader = request.headers.get('Cookie');
    const cookies = parseCookies(cookieHeader);
    token = cookies['token']; // Adjust 'token' to the name of your cookie
  }

  if (!token) {
    return { error: 'Authorization token missing or invalid', status: 401 };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    console.log(decoded);
    return { user: decoded, error: null }; // Successfully decoded user from the token
  } catch (error) {
    return { error: 'Invalid or expired token', status: 401 }; // Token verification failed
  }
}
