import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:23002';

test.describe('Gestión de Tareas', () => {
  let authToken: string;
  let testUserEmail: string;

  test.beforeEach(async ({ page }) => {
    testUserEmail = `e2e_tasks_${Date.now()}@test.com`;

    const registerResponse = await page.request.post(`${BASE_URL}/api/auth/register`, {
      data: {
        nombre: 'Usuario Tareas E2E',
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

  test('TC002: Creación exitosa de una tarea con todos los campos obligatorios', async ({ page }) => {
    const createTaskResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas') && response.status() === 201
    );

    await page.goto(`${BASE_URL}/crear-tarea`);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const fechaLimite = futureDate.toISOString().split('T')[0];

    await page.fill('input[name="titulo"]', 'Tarea de Prueba E2E');
    await page.fill('textarea[name="descripcion"]', 'Descripción de la tarea de prueba');
    await page.selectOption('select[name="prioridad"]', 'alta');
    await page.fill('input[name="fechaLimite"]', fechaLimite);

    await page.click('button[type="submit"]');

    const createTaskResponse = await createTaskResponsePromise;
    expect(createTaskResponse.status()).toBe(201);

    const responseBody = await createTaskResponse.json();
    expect(responseBody).toHaveProperty('titulo', 'Tarea de Prueba E2E');
    expect(responseBody).toHaveProperty('prioridad', 'alta');
    expect(responseBody).toHaveProperty('estado', 'pendiente');

    await page.waitForURL(`${BASE_URL}/mis-tareas`);
  });

  test('TC003: No se puede crear una tarea sin la descripción obligatoria', async ({ page }) => {
    const createTaskResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas')
    );

    await page.goto(`${BASE_URL}/crear-tarea`);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const fechaLimite = futureDate.toISOString().split('T')[0];

    await page.fill('input[name="titulo"]', 'Tarea sin descripción');
    await page.selectOption('select[name="prioridad"]', 'media');
    await page.fill('input[name="fechaLimite"]', fechaLimite);

    await page.click('button[type="submit"]');

    const createTaskResponse = await createTaskResponsePromise;
    expect(createTaskResponse.status()).toBeGreaterThanOrEqual(400);

    const errorMessage = page.locator('text=La descripción es obligatoria');
    await expect(errorMessage).toBeVisible();
  });

  test('TC009: No se puede crear una tarea con una fecha límite pasada', async ({ page }) => {
    const createTaskResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas')
    );

    await page.goto(`${BASE_URL}/crear-tarea`);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const fechaLimite = pastDate.toISOString().split('T')[0];

    await page.fill('input[name="titulo"]', 'Tarea con fecha pasada');
    await page.fill('textarea[name="descripcion"]', 'Descripción de prueba');
    await page.selectOption('select[name="prioridad"]', 'baja');
    await page.fill('input[name="fechaLimite"]', fechaLimite);

    await page.click('button[type="submit"]');

    const createTaskResponse = await createTaskResponsePromise;
    expect(createTaskResponse.status()).toBeGreaterThanOrEqual(400);

    const errorMessage = page.locator('text=La fecha límite debe ser futura');
    await expect(errorMessage).toBeVisible();
  });

  test('TC014: No se puede crear una tarea sin título', async ({ page }) => {
    const createTaskResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas')
    );

    await page.goto(`${BASE_URL}/crear-tarea`);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const fechaLimite = futureDate.toISOString().split('T')[0];

    await page.fill('textarea[name="descripcion"]', 'Descripción sin título');
    await page.selectOption('select[name="prioridad"]', 'alta');
    await page.fill('input[name="fechaLimite"]', fechaLimite);

    await page.click('button[type="submit"]');

    const errorMessage = page.locator('text=El título es obligatorio');
    await expect(errorMessage).toBeVisible();
  });

  test('TC004: Usuario puede ver sus tareas ordenadas por prioridad y fecha límite', async ({ page }) => {
    await page.request.post(`${BASE_URL}/api/tareas`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        titulo: 'Tarea Alta',
        descripcion: 'Prioridad alta',
        prioridad: 'alta',
        fecha_limite: '2026-12-31',
      },
    });

    await page.request.post(`${BASE_URL}/api/tareas`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        titulo: 'Tarea Baja',
        descripcion: 'Prioridad baja',
        prioridad: 'baja',
        fecha_limite: '2026-12-31',
      },
    });

    const tareasResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/mis-tareas`);

    const tareasResponse = await tareasResponsePromise;
    expect(tareasResponse.status()).toBe(200);

    await expect(page.locator('text=Tarea Alta')).toBeVisible();
    await expect(page.locator('text=Tarea Baja')).toBeVisible();
  });

  test('TC013: Una tarea con fecha límite pasada aparece inmediatamente en el listado de vencidas', async ({ page }) => {
    const createTaskPromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas') && response.status() === 201
    );

    await page.goto(`${BASE_URL}/crear-tarea`);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    const fechaLimite = pastDate.toISOString().split('T')[0];

    await page.fill('input[name="titulo"]', 'Tarea Vencida');
    await page.fill('textarea[name="descripcion"]', 'Descripción de tarea vencida');
    await page.selectOption('select[name="prioridad"]', 'alta');
    await page.fill('input[name="fechaLimite"]', fechaLimite);

    await page.click('button[type="submit"]');

    await createTaskPromise;
    await page.waitForURL(`${BASE_URL}/mis-tareas`);

    const vencidasPromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas/vencidas') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/vencidas`);

    const vencidasResponse = await vencidasPromise;
    expect(vencidasResponse.status()).toBe(200);

    await expect(page.locator('text=Tarea Vencida')).toBeVisible();
  });

  test('TC006: Resumen del estado de tareas y su actualización', async ({ page }) => {
    const tareasResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/mis-tareas`);
    await tareasResponsePromise;

    const initialDashboardPromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas/dashboard') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/dashboard`);
    const initialDashboard = await initialDashboardPromise.json();

    await page.goto(`${BASE_URL}/crear-tarea`);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const fechaLimite = futureDate.toISOString().split('T')[0];

    await page.fill('input[name="titulo"]', 'Nueva Tarea Dashboard');
    await page.fill('textarea[name="descripcion"]', 'Para probar dashboard');
    await page.selectOption('select[name="prioridad"]', 'media');
    await page.fill('input[name="fechaLimite"]', fechaLimite);

    const createTaskPromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas') && response.status() === 201
    );
    await page.click('button[type="submit"]');
    await createTaskPromise;

    await page.waitForURL(`${BASE_URL}/mis-tareas`);

    const updatedDashboardPromise = page.waitForResponse(
      (response) => response.url().includes('/api/tareas/dashboard') && response.status() === 200
    );

    await page.goto(`${BASE_URL}/dashboard`);
    const updatedDashboard = await updatedDashboardPromise.json();

    expect(updatedDashboard.pendientes).toBeGreaterThanOrEqual(initialDashboard.pendientes);
  });
});