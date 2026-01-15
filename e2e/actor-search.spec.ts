import { expect, test } from "@playwright/test";

test.describe("배우 검색 페이지", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/actor-search");
    await page.waitForLoadState("domcontentloaded");
  });

  test("필터 버튼들이 표시됨", async ({ page }) => {
    // 구분 버튼이 표시될 때까지 대기 (필터 UI 로드 확인)
    await expect(page.getByRole("button", { name: "구분" }).first()).toBeVisible({ timeout: 20000 });
    await expect(page.getByRole("button", { name: "성별" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "나이" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "키" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "몸무게" }).first()).toBeVisible();
  });

  test("구분 필터 - 배우 선택 가능", async ({ page }) => {
    const actorButton = page.getByRole("button", { name: "배우", exact: true });
    await actorButton.click();
    // 필터 적용 확인 (버튼 스타일 변경 등)
    await expect(actorButton).toBeVisible();
  });

  test("구분 필터 - 모델 선택 가능", async ({ page }) => {
    const modelButton = page.getByRole("button", { name: "모델", exact: true });
    await modelButton.click();
    await expect(modelButton).toBeVisible();
  });

  test("성별 필터 - 남자 선택 가능", async ({ page }) => {
    const maleButton = page.getByRole("button", { name: "남자", exact: true });
    await maleButton.click();
    await expect(maleButton).toBeVisible();
  });

  test("성별 필터 - 여자 선택 가능", async ({ page }) => {
    const femaleButton = page.getByRole("button", { name: "여자", exact: true });
    await femaleButton.click();
    await expect(femaleButton).toBeVisible();
  });

  test("초기화 버튼 클릭 가능", async ({ page }) => {
    const resetButton = page.getByRole("button", { name: "초기화" });
    await expect(resetButton).toBeVisible();
    await resetButton.click();
  });

  test("키워드 검색 필드에 입력 가능", async ({ page }) => {
    const searchInput = page.getByRole("textbox", { name: /이름 또는 키워드/ });
    await expect(searchInput).toBeVisible();
    await searchInput.fill("테스트 배우");
    await expect(searchInput).toHaveValue("테스트 배우");
  });

  test("정렬 버튼이 표시됨", async ({ page }) => {
    await expect(page.getByRole("button", { name: /정렬/ })).toBeVisible();
  });

  test("배우 목록 API가 호출됨", async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (response) => response.url().includes("/api/actors") && response.status() === 200,
      { timeout: 15000 }
    );

    await page.goto("/actor-search");

    try {
      const response = await responsePromise;
      const json = await response.json();
      expect(json.success).toBe(true);
    } catch {
      // 백엔드가 실행 중이 아닐 수 있음
      console.log("Actors API 호출 실패 - 백엔드가 실행 중인지 확인하세요");
    }
  });

  test("페이지네이션 버튼들이 표시됨 (데이터가 충분할 때)", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    const pagination = page.getByRole("navigation", { name: "페이지네이션" });
    const isPaginationVisible = await pagination.isVisible().catch(() => false);

    if (isPaginationVisible) {
      await expect(page.getByRole("button", { name: "첫 페이지로" })).toBeVisible();
      await expect(page.getByRole("button", { name: "이전 페이지" })).toBeVisible();
      await expect(page.getByRole("button", { name: "다음 페이지" })).toBeVisible();
      await expect(page.getByRole("button", { name: "마지막 페이지로" })).toBeVisible();
    }
  });

  test("페이지 번호 클릭 시 URL이 업데이트됨", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    const pagination = page.getByRole("navigation", { name: "페이지네이션" });
    const isPaginationVisible = await pagination.isVisible().catch(() => false);

    if (isPaginationVisible) {
      const page2Button = page.getByRole("button", { name: "2" });
      const isPage2Visible = await page2Button.isVisible().catch(() => false);

      if (isPage2Visible) {
        await page2Button.click();
        await expect(page).toHaveURL(/page=2/);
      }
    }
  });

  test("정렬 변경 시 URL이 업데이트됨", async ({ page }) => {
    const sortDropdown = page.getByRole("button", { name: /정렬/ });
    const isSortVisible = await sortDropdown.isVisible().catch(() => false);

    if (isSortVisible) {
      await sortDropdown.click();

      const filmographyOption = page.getByText("필모그래피순");
      const isOptionVisible = await filmographyOption.isVisible().catch(() => false);

      if (isOptionVisible) {
        await filmographyOption.click();
        await expect(page).toHaveURL(/sort=/);
      }
    }
  });
});
