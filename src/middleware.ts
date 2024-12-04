import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function middleware(req: NextRequest){
    // get the pathname of the request
    const pathname = req.nextUrl.pathname;

    // get the token from the cookie
    const cookie_token = req.cookies.get('token')?.value;

    if(pathname.startsWith('/cgm-admin')){
        if(!cookie_token){
            // If the token is not found, redirect to the signin page
            if(pathname.startsWith('/cgm-admin/signin')) return NextResponse.next();
        }
    
        // fetch the token from the server
        try {
            const response = await axios.post(`${process.env.API_URL}/admin/auth`, {
                token: cookie_token
            });
            const { data } = response.data as { data: number };
    
            if(pathname.startsWith('/cgm-admin') && (data === 0 || data === undefined)){    
                // If the token is not found, redirect to the signin page
                return NextResponse.redirect(new URL('/cgm-admin/signin', req.url));
            }
            
            if (pathname.startsWith('/cgm-admin/signin') && (data !== 0 || data !== undefined)){
                // If the token is not found, redirect to the signin page
                return NextResponse.redirect(new URL('/cgm-admin/dashboard', req.url));
            }
    
            return NextResponse.next();
        } catch (error) {
            if(pathname.startsWith('/cgm-admin')){    
                // If the token is not found, redirect to the signin page
                return NextResponse.redirect(new URL('/cgm-admin/signin', req.url));
            }
            
            if (pathname.startsWith('/cgm-admin/signin')){
                // If the token is not found, redirect to the signin page
                return NextResponse.redirect(new URL('/cgm-admin/dashboard', req.url));
            }
        }
    }
}

export const config = {
    matcher: [
        '/cgm-admin/:path*',
    ]
}