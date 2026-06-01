import { NextResponse } from 'next/server';

/** Respuesta exitosa (200) */
export function ok<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 200 });
}

/** Recurso creado (201) */
export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

/** Recurso actualizado (200) */
export function updated<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 200 });
}

/** Sin contenido (204) */
export function noContent() {
  return new NextResponse(null, { status: 204 });
}

/** Bad request (400) */
export function badRequest(message = 'Bad request') {
  return NextResponse.json(
    { success: false, error: { message } },
    { status: 400 }
  );
}

/** No autorizado (401) */
export function unauthorized(message = 'Unauthorized') {
  return NextResponse.json(
    { success: false, error: { message } },
    { status: 401 }
  );
}

/** Prohibido (403) */
export function forbidden(message = 'Forbidden') {
  return NextResponse.json(
    { success: false, error: { message } },
    { status: 403 }
  );
}

/** No encontrado (404) */
export function notFound(message = 'Not found') {
  return NextResponse.json(
    { success: false, error: { message } },
    { status: 404 }
  );
}

/** Error interno (500) */
export function internalError(message = 'Internal server error') {
  return NextResponse.json(
    { success: false, error: { message } },
    { status: 500 }
  );
}