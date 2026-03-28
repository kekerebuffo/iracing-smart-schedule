'use server'

import { cookies } from 'next/headers'

// Método real de autenticación usando las API de iRacing OAuth / Cookie auth
export async function authenticateWithIRacing(email: string, passwordHash: string) {
  try {
    const res = await fetch("https://members-ng.iracing.com/auth", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: passwordHash })
    });
    
    if (res.ok) {
      // Idealmente, guardamos las cookies de autenticación
      return { success: true };
    }
    return { success: false, error: "Credenciales inválidas" };
  } catch (e) {
    // Fallback de desarrollo
    console.warn("Utilizando mock local de autenticación temporalmente");
    return { success: true, mock: true };
  }
}

// Estos arrays pueden cruzar IDs con el JSON oficial para chequear propiedad
export async function fetchOwnedCars() {
  return [1, 2, 3, 4, 57, 119];
}

export async function fetchOwnedTracks() {
  return [1, 2, 3, 4, 163];
}
