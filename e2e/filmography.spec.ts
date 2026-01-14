import { expect, test } from "@playwright/test";

const mockFilmography = [
  {
    id: "film-1",
    actorId: "1",
    title: "테스트 드라마",
    year: 2024,
    type: "드라마",
    typeDisplayName: "드라마",
    role: "주인공 역",
    roleType: "주연",
    roleTypeDisplayName: "주연",
    thumbnailUrl: null,
    description: "테스트 설명",
    director: "테스트 감독",
    production: "테스트 제작사",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "film-2",
    actorId: "1",
    title: "테스트 영화",
    year: 2023,
    type: "영화",
    typeDisplayName: "영화",
    role: "조연 역",
    roleType: "조연",
    roleTypeDisplayName: "조연",
    thumbnailUrl: null,
    description: null,
    director: null,
    production: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

test.describe("필모그래피 관리 페이지", () => {
  test.beforeEach(async ({ page }) => {
    // 사용자 정보 모킹
    await page.route("**/api/users/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: "1", email: "test@example.com", type: "actor" },
        }),
      });
    });

    // 배우 프로필 모킹
    await page.route("**/api/actors/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            id: "1",
            email: "test@example.com",
            name: "테스트 배우",
            stageName: "스타배우",
            profileImage: null,
            birthYear: 1995,
            introduction: "안녕하세요",
            nationality: "대한민국",
            height: 175,
            weight: 65,
            skills: ["액션", "코미디"],
            languages: ["한국어", "영어"],
            agency: "테스트 소속사",
            isProfileComplete: true,
          },
        }),
      });
    });

    // 필모그래피 목록 모킹
    await page.route("**/api/actors/*/filmography", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: mockFilmography,
        }),
      });
    });

    // 필모그래피 생성/수정/삭제 모킹
    await page.route("**/api/filmography", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              id: "film-new",
              ...JSON.parse(route.request().postData() || "{}"),
            },
          }),
        });
      }
    });

    await page.route("**/api/filmography/*", async (route) => {
      if (route.request().method() === "PUT") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              id: "film-1",
              ...JSON.parse(route.request().postData() || "{}"),
            },
          }),
        });
      } else if (route.request().method() === "DELETE") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: null,
          }),
        });
      } else if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: mockFilmography[0],
          }),
        });
      }
    });

    // 인증 상태 설정
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "auth-storage",
        JSON.stringify({
          state: {
            isAuthenticated: true,
            userType: "actor",
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token",
            user: { id: "1", email: "test@example.com", type: "actor" },
          },
          version: 0,
        })
      );
    });

    await page.goto("/profile/filmography");
    await page.waitForLoadState("networkidle");
  });

  test("필모그래피 관리 페이지 제목 표시", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "필모그래피 관리" })).toBeVisible({ timeout: 10000 });
  });

  test("추가 버튼 표시", async ({ page }) => {
    await expect(page.getByRole("button", { name: /추가/ })).toBeVisible({ timeout: 10000 });
  });

  test("필모그래피 목록 표시", async ({ page }) => {
    await expect(page.getByText("테스트 드라마")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("테스트 영화")).toBeVisible({ timeout: 10000 });
  });

  test("필모그래피 연도별 그룹화", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "2024" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: "2023" })).toBeVisible({ timeout: 10000 });
  });

  test("필모그래피 추가 모달 열기", async ({ page }) => {
    await page.getByRole("button", { name: /추가/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: "필모그래피 추가" })).toBeVisible();
  });

  test("필모그래피 추가 폼 필드 표시", async ({ page }) => {
    await page.getByRole("button", { name: /추가/ }).click();
    await expect(page.getByPlaceholder("작품 제목을 입력하세요")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: "추가하기" })).toBeVisible();
    await expect(page.getByRole("button", { name: "취소" })).toBeVisible();
  });

  test("필모그래피 추가 시 API 호출", async ({ page }) => {
    const createRequest = page.waitForRequest(
      (request) => request.url().includes("/api/filmography") && request.method() === "POST",
      { timeout: 10000 }
    );

    await page.getByRole("button", { name: /추가/ }).click();
    await page.getByPlaceholder("작품 제목을 입력하세요").fill("새 영화");
    await page.getByRole("button", { name: "추가하기" }).click();

    const request = await createRequest;
    const postData = JSON.parse(request.postData() || "{}");
    expect(postData.title).toBe("새 영화");
  });

  test("취소 버튼 클릭 시 모달 닫기", async ({ page }) => {
    await page.getByRole("button", { name: /추가/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 10000 });
    await page.getByRole("button", { name: "취소" }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 5000 });
  });

  test("뒤로 가기 버튼 클릭 시 프로필 페이지로 이동", async ({ page }) => {
    await page.getByRole("button", { name: "뒤로 가기" }).click();
    await expect(page).toHaveURL("/profile", { timeout: 10000 });
  });
});

test.describe("필모그래피 페이지 - 빈 상태", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/api/users/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: { id: "1", email: "test@example.com", type: "actor" },
        }),
      });
    });

    await page.route("**/api/actors/*/filmography", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: [],
        }),
      });
    });

    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "auth-storage",
        JSON.stringify({
          state: {
            isAuthenticated: true,
            userType: "actor",
            accessToken: "mock-access-token",
            refreshToken: "mock-refresh-token",
            user: { id: "1", email: "test@example.com", type: "actor" },
          },
          version: 0,
        })
      );
    });

    await page.goto("/profile/filmography");
    await page.waitForLoadState("networkidle");
  });

  test("필모그래피가 없으면 빈 상태 메시지 표시", async ({ page }) => {
    await expect(page.getByText("아직 등록된 필모그래피가 없습니다")).toBeVisible({ timeout: 10000 });
  });

  test("빈 상태에서 첫 필모그래피 추가 버튼 표시", async ({ page }) => {
    await expect(page.getByRole("button", { name: /첫 필모그래피 추가/ })).toBeVisible({ timeout: 10000 });
  });
});

test.describe("필모그래피 페이지 - 인증 없는 경우", () => {
  test("미로그인 상태에서 로그인 페이지로 리다이렉트", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("auth-storage"));

    await page.goto("/profile/filmography");
    await expect(page).toHaveURL("/login", { timeout: 10000 });
  });
});
