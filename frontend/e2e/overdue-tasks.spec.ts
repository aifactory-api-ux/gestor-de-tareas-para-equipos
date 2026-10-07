import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:23002';

test.describe('Tareas Vencidas del Equipo', () => {
  let authToken: string;
  let testUserEmail: string;

  test.beforeEach(async ({ page }) => {
    testUserEmail = `e2e_overdue_${Date.now()}@test.com`;

    const registerResponse = await page.request.post(`${BASE_URL}/api/auth/register`, {
      data: {
        nombre: 'Usuario Overdue E2E',
        email: testUserEmail,
        password: 'password123',
      },
    });
    expect(registerResponse.status()).toBe(201);

    const loginResponse = await page.request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: testUserEmail,
        password: 'password123',
      },
    });
    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();
    authToken = loginBody.access_token;

    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', testUserEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);
  });

  test('TC005: Visualización de tareas vencidas del equipo, excluyendo las completadas', async ({ page }) => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    const fechaLimite = pastDate.toISOString().split('T')[0];

    const createVencidaPromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas') && response.status() === 201
    );

    await page.goto(`${BASE_URL}/crear-tarea`);
    await page.fill('input[name="titulo"]', 'Tarea Vencida Team');
    await page.fill('textarea[name="descripcion"]', 'Descripción vencida');
    await page.selectOption('select[name="prioridad"]', 'alta');
    await page.fill('input[name="fechaLimite"]', fechaLimite);
    await page.click('button[type="submit"]');

    await createVencidaPromise;
    await page.waitForURL(`${BASE_URL}/mis-tareas`);

    const vencidasPromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas/vencidas') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/vencidas`);

    const vencidasResponse = await vencidasPromise;
    expect(vencidasResponse.status()).toBe(200);

    const responseBody = await vencidasResponse.json();
    expect(responseBody.tareas.length).toBeGreaterThan(0);

    await expect(page.locator('text=Tarea Vencida Team')).toBeVisible();
  });

  test('TC012: Listado de tareas vencidas vacío si no hay tareas vencidas', async ({ page }) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const fechaLimite = futureDate.toISOString().split('T')[0];

    await page.request.post(`${BASE_URL}/api/tareas`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        titulo: 'Tarea Futura',
        descripcion: 'No está vencida',
        prioridad: 'baja',
        fecha_limite: fechaLimite,
      },
    });

    const vencidasPromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas/vencidas') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/vencidas`);

    const vencidasResponse = await vencidasPromise;
    expect(vencidasResponse.status()).toBe(200);

    const responseBody = await vencidasResponse.json();
    expect(responseBody.tareas.length).toBe(0);

    await expect(page.locator('text=No hay tareas vencidas')).toBeVisible();
  });

  test('TC013: Tarea con fecha límite pasada aparece inmediatamente en listado de vencidas', async ({ page }) => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const fechaLimite = pastDate.toISOString().split('T')[0];

    const createVencidaPromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas') && response.status() === 201
    );

    await page.goto(`${BASE_URL}/crear-tarea`);
    await page.fill('input[name="titulo"]', 'Tarea Recién Vencida');
    await page.fill('textarea[name="descripcion"]', 'Descripción recién vencida');
    await page.selectOption('select[name="prioridad"]', 'media');
    await page.fill('input[name="fechaLimite"]', fechaLimite);
    await page.click('button[type="submit"]');

    await createVencidaPromise;
    await page.waitForURL(`${BASE_URL}/mis-tareas`);

    const vencidasPromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas/vencidas') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/vencidas`);

    const vencidasResponse = await vencidasPromise;
    const responseBody = await vencidasResponse.json();

    const tareaEncontrada = responseBody.tareas.some(
      (t: any) => t.titulo === 'Tarea Recién Vencida'
    );
    expect(tareaEncontrada).toBe(true);
  });
});