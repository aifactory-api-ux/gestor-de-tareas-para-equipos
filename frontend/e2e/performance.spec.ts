import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:23002';

test.describe('Pruebas de Rendimiento (NFR)', () => {
  let authToken: string;
  let testUserEmail: string;

  test.beforeEach(async ({ page }) => {
    testUserEmail = `e2e_perf_${Date.now()}@test.com`;

    const registerResponse = await page.request.post(`${BASE_URL}/api/auth/register`, {
      data: {
        nombre: 'Usuario Performance E2E',
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
  });

  test('NFR001: Tiempo de carga de la lista de tareas de un usuario < 2 segundos', async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.request.post(`${BASE_URL}/api/tareas`, {
        headers: { Authorization: `Bearer ${authToken}` },
        data: {
          titulo: `Tarea Performance ${i}`,
          descripcion: `Descripción tarea ${i}`,
          prioridad: ['alta', 'media', 'baja'][i % 3],
          fecha_limite: '2026-12-31',
        },
      });
    }

    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', testUserEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);

    const startTime = Date.now();

    const tareasResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/mis-tareas`);

    await tareasResponsePromise;

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    expect(loadTime).toBeLessThan(2000);
  });

  test('NFR002: Tiempo de carga de la lista de tareas vencidas < 3 segundos', async ({ page }) => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const fechaLimite = pastDate.toISOString().split('T')[0];

    for (let i = 0; i < 3; i++) {
      await page.request.post(`${BASE_URL}/api/tareas`, {
        headers: { Authorization: `Bearer ${authToken}` },
        data: {
          titulo: `Tarea Vencida Perf ${i}`,
          descripcion: `Descripción vencida ${i}`,
          prioridad: 'alta',
          fecha_limite: fechaLimite,
        },
      });
    }

    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', testUserEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);

    const startTime = Date.now();

    const vencidasResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas/vencidas') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/vencidas`);

    await vencidasResponsePromise;

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    expect(loadTime).toBeLessThan(3000);
  });

  test('NFR003: Tiempo de respuesta del backend al crear una tarea < 1 segundo', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', testUserEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const fechaLimite = futureDate.toISOString().split('T')[0];

    const startTime = Date.now();

    const createTaskResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas') && response.status() === 201
    );

    await page.goto(`${BASE_URL}/crear-tarea`);
    await page.fill('input[name="titulo"]', 'Tarea Rápida');
    await page.fill('textarea[name="descripcion"]', 'Descripción rápida');
    await page.selectOption('select[name="prioridad"]', 'baja');
    await page.fill('input[name="fechaLimite"]', fechaLimite);
    await page.click('button[type="submit"]');

    await createTaskResponsePromise;

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(responseTime).toBeLessThan(1000);
  });

  test('NFR005: Tiempo de respuesta de login < 1.5 segundos', async ({ page }) => {
    const startTime = Date.now();

    const loginResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/auth/login') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="email"]', testUserEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await loginResponsePromise;

    const endTime = Date.now();
    const loginTime = endTime - startTime;

    expect(loginTime).toBeLessThan(1500);
  });
});