import { NextResponse } from 'next/server';
import IracingApi from 'iracing-data-api';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const api = new IracingApi();
    
    console.log(`Intentando login para: ${email}`);
    const loginResult = await api.login(email, password);
    
    console.log('Login result from iRacing:', loginResult);

    if (loginResult && loginResult.error) {
      console.error('Error de auth iRacing:', loginResult);
      return NextResponse.json({ 
        error: 'La autenticación falló. Revisa tu correo y contraseña.',
        details: loginResult 
      }, { status: 401 });
    }

    // Fetch data from iRacing
    const cars = await api.car.get();
    const tracks = await api.track.get();
    
    // Some iRacing API wrappers return { data: [...] }, others return [...] directly
    // Also fetch member info just in case ownership is stored there
    const memberInfo = await api.member.info();

    return NextResponse.json({ 
      success: true, 
      cars, 
      tracks,
      memberInfo 
    });
    
  } catch (error: any) {
    console.error('iRacing sync error:', error);
    return NextResponse.json({ error: error.message || 'Server error during sync' }, { status: 500 });
  }
}
