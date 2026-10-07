import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:23002';

test.describe('Dashboard', () => {
  let authToken: string;
  let testUserEmail: string;

  test.beforeEach(async ({ page }) => {
    testUserEmail = `e2e_dashboard_${Date.now()}@test.com`;

    const registerResponse = await page.request.post(`${BASE_URL}/api/auth/register`, {
      data: {
        nombre: 'Usuario Dashboard E2E',
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

  test('Carga de dashboard con métricas de tareas', async ({ page }) => {
    const dashboardResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas/dashboard') && response.status() === 200
    );

    await page.reload();

    const dashboardResponse = await dashboardResponsePromise;
    expect(dashboardResponse.status()).toBe(200);

    const dashboardData = await dashboardResponse.json();
    expect(dashboardData).toHaveProperty('pendientes');
    expect(dashboardData).toHaveProperty('en_curso');
    expect(dashboardData).toHaveProperty('terminadas');
    expect(dashboardData).toHaveProperty('total');

    await expect(page.locator('text=Total')).toBeVisible();
    await expect(page.locator('text=En curso')).toBeVisible();
    await expect(page.locator('text=Vencidas')).toBeVisible();
    await expect(page.locator('text=Terminadas')).toBeVisible();
  });

  test('Navegación desde dashboard a otras páginas', async ({ page }) => {
    await page.click('text=Nueva tarea');
    await expect(page).toHaveURL(`${BASE_URL}/crear-tarea`);

    await page.goto(`${BASE_URL}/dashboard`);
    await page.click('text=Ver mis tareas');
    await expect(page).toHaveURL(`${BASE_URL}/mis-tareas`);
  });

  test('Tarea vencida muestra alerta en dashboard', async ({ page }) => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const fechaLimite = pastDate.toISOString().split('T')[0];

    await page.request.post(`${BASE_URL}/api/tareas`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        titulo: 'Tarea Vencida Dashboard',
        descripcion: 'Descripción vencida',
        prioridad: 'alta',
        fecha_limite: fechaLimite,
      },
    });

    const dashboardPromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas/dashboard') && response.status() === 200
    );
    const vencidasPromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas/vencidas') && response.status() === 200
    );

    await page.reload();

    await dashboardPromise;
    await vencidasPromise;

    await expect(page.locator('text=Tienes')).toBeVisible();
    await expect(page.locator('text=tarea')).toBeVisible();
  });

  test('Tiempo de carga del dashboard', async ({ page }) => {
    const startTime = Date.now();

    await page.reload();

    await page.waitForResponse(
      (response) => response.url().includes('/api/tareas/dashboard') && response.status() === 200
    );

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    expect(loadTime).toBeLessThan(3000);
  });
});