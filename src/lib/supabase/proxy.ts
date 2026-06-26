import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import type { Database } from './database.types'

const AUTH_ROUTES = ['/entrar', '/resetar-senha']
const PUBLIC_ROUTES = ['/rv-publico']

function matchesRoute(routes: string[], pathname: string) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

function isAuthRoute(pathname: string) {
  return matchesRoute(AUTH_ROUTES, pathname)
}

function isPublicRoute(pathname: string) {
  return isAuthRoute(pathname) || matchesRoute(PUBLIC_ROUTES, pathname)
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  if (!user && !isPublicRoute(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/entrar'
    url.searchParams.set('redirectTo', pathname)
    const redirectResponse = NextResponse.redirect(url)
    cookiesToSetFromResponse(supabaseResponse, redirectResponse)
    return redirectResponse
  }

  if (user && isAuthRoute(pathname)) {
    const redirectResponse = NextResponse.redirect(new URL('/', request.url))
    cookiesToSetFromResponse(supabaseResponse, redirectResponse)
    return redirectResponse
  }

  return supabaseResponse
}

function cookiesToSetFromResponse(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie)
  })
}