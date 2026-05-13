/**
 * Manejo seguro del token JWT.
 *
 * ⚠️ RECOMENDACIÓN DE SEGURIDAD:
 * Lo IDEAL es que el backend envíe el token JWT en una cookie HttpOnly + Secure + SameSite=Strict,
 * para que el JS del navegador NO pueda leerlo (mitiga XSS). En ese caso este archivo no sería necesario.
 *
 * Mientras no esté implementado en el backend, usamos sessionStorage (se borra al cerrar pestaña),
 * que es más seguro que localStorage frente a un atacante con sesión persistente.
 */

const TOKEN_KEY = 'hc_token';

export const tokenStorage = {
    get: (): string | null => sessionStorage.getItem(TOKEN_KEY),
    set: (token: string): void => sessionStorage.setItem(TOKEN_KEY, token),
    remove: (): void => sessionStorage.removeItem(TOKEN_KEY),
};