import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:23002';

test.describe('Autenticación', () => {
  const testUser = {
    nombre: 'Usuario E2E',
    email: `e2e_${Date.now()}@test.com`,
    password: 'password123',
  };

  test('TC007: Inicio de sesión exitoso con credenciales válidas', async ({ page }) => {
    const loginResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/auth/login') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);

    await page.click('button[type="submit"]');

    const loginResponse = await loginResponsePromise;
    expect(loginResponse.status()).toBe(200);

    const responseBody = await loginResponse.json();
    expect(responseBody).toHaveProperty('access_token');
    expect(responseBody).toHaveProperty('usuario');
    expect(responseBody.usuario).toHaveProperty('email', testUser.email);

    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('TC010: Inicio de sesión falla con credenciales inválidas', async ({ page }) => {
    const loginResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/auth/login')
    );

    await page.goto(`${BASE_URL}/login`);

    await page.fill('input[name="email"]', 'invalid@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    const loginResponse = await loginResponsePromise;
    expect(loginResponse.status()).toBe(401);

    const errorMessage = page.locator('text=Credenciales inválidas');
    await expect(errorMessage).toBeVisible();
  });

  test('TC001: Registro exitoso de un nuevo usuario con datos válidos', async ({ page }) => {
    const uniqueEmail = `e2e_reg_${Date.now()}@test.com`;

    const registerResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/auth/register') && response.status() === 201
    );

    await page.goto(`${BASE_URL}/register`);

    await page.fill('input[name="nombre"]', 'Nuevo Usuario E2E');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');

    await page.click('button[type="submit"]');

    const registerResponse = await registerResponsePromise;
    expect(registerResponse.status()).toBe(201);

    const responseBody = await registerResponse.json();
    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toHaveProperty('email', uniqueEmail);
    expect(responseBody).toHaveProperty('rol', 'member');

    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });

  test('TC015: Registro falla si el correo electrónico ya está en uso', async ({ page }) => {
    const existingEmail = `e2e_existing_${Date.now()}@test.com`;

    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[name="nombre"]', 'Usuario Existente');
    await page.fill('input[name="email"]', existingEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/login`);

    const registerConflictPromise = page.waitForResponse(
      (response) => response.url().includes('/api/auth/register')
    );

    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[name="nombre"]', 'Otro Usuario');
    await page.fill('input[name="email"]', existingEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');

    await page.click('button[type="submit"]');

    const registerResponse = await registerConflictPromise;
    expect(registerResponse.status()).toBe(409);

    const errorMessage = page.locator('text=El correo electrónico ya está registrado');
    await expect(errorMessage).toBeVisible();
  });

  test('TC011: Las solicitudes autenticadas funcionan correctamente después del login JWT', async ({ page }) => {
    const authResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/auth/login') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await authResponsePromise;
    await page.waitForURL(`${BASE_URL}/dashboard`);

    const dashboardResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas/dashboard') && response.status() === 200
    );

    await page.reload();

    const dashboardResponse = await dashboardResponsePromise;
    expect(dashboardResponse.status()).toBe(200);

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });
});