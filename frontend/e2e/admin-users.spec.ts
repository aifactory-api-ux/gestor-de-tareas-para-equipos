import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:23002';

test.describe('Gestión de Usuarios (Admin)', () => {
  let adminToken: string;
  let adminEmail: string;
  let adminId: string;

  test.beforeEach(async ({ page }) => {
    adminEmail = `e2e_admin_${Date.now()}@test.com`;

    const registerResponse = await page.request.post(`${BASE_URL}/api/auth/register`, {
      data: {
        nombre: 'Admin E2E',
        email: adminEmail,
        password: 'password123',
      },
    });
    expect(registerResponse.status()).toBe(201);

    const loginResponse = await page.request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: adminEmail,
        password: 'password123',
      },
    });
    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();
    adminToken = loginBody.access_token;
    adminId = loginBody.usuario.id;
  });

  test('TC008: Administrador puede acceder y ver el listado de usuarios', async ({ page }) => {
    await page.request.patch(`${BASE_URL}/api/usuarios/${adminId}/rol`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      data: { rol: 'admin' },
    });

    const memberEmail = `e2e_member_${Date.now()}@test.com`;
    await page.request.post(`${BASE_URL}/api/auth/register`, {
      data: {
        nombre: 'Miembro E2E',
        email: memberEmail,
        password: 'password123',
      },
    });

    const usuariosResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/usuarios') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', adminEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);

    await page.goto(`${BASE_URL}/usuarios`);

    const usuariosResponse = await usuariosResponsePromise;
    expect(usuariosResponse.status()).toBe(200);

    await expect(page.locator('text=Gestión de usuarios')).toBeVisible();
  });

  test('NFR001: Solo administradores pueden acceder a la gestión de usuarios', async ({ page }) => {
    const normalEmail = `e2e_normal_${Date.now()}@test.com`;

    await page.request.post(`${BASE_URL}/api/auth/register`, {
      data: {
        nombre: 'Usuario Normal E2E',
        email: normalEmail,
        password: 'password123',
      },
    });

    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', normalEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);

    await page.goto(`${BASE_URL}/usuarios`);

    await expect(page.locator('text=Acceso denegado')).toBeVisible();
    await expect(page.locator('text=No tienes permisos para acceder a esta sección')).toBeVisible();
  });
});