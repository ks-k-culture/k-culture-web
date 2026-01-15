import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it("totalPages가 1이면 렌더링하지 않음", () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} onPageChange={mockOnPageChange} />);
    expect(container.firstChild).toBeNull();
  });

  it("기본 페이지네이션을 올바르게 렌더링", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
  });

  it("현재 페이지에 aria-current 속성이 있음", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    const currentPageButton = screen.getByRole("button", { name: "3" });
    expect(currentPageButton).toHaveAttribute("aria-current", "page");
  });

  it("페이지 번호 클릭 시 onPageChange 호출", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "3" }));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("첫 페이지에서 이전 버튼이 비활성화됨", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    const prevButton = screen.getByRole("button", { name: "이전 페이지" });
    const firstButton = screen.getByRole("button", { name: "첫 페이지로" });

    expect(prevButton).toBeDisabled();
    expect(firstButton).toBeDisabled();
  });

  it("마지막 페이지에서 다음 버튼이 비활성화됨", () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />);

    const nextButton = screen.getByRole("button", { name: "다음 페이지" });
    const lastButton = screen.getByRole("button", { name: "마지막 페이지로" });

    expect(nextButton).toBeDisabled();
    expect(lastButton).toBeDisabled();
  });

  it("다음 페이지 버튼 클릭 시 onPageChange 호출", () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "다음 페이지" }));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it("이전 페이지 버튼 클릭 시 onPageChange 호출", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "이전 페이지" }));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("많은 페이지가 있을 때 말줄임표(...) 표시", () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />);

    // 말줄임표가 표시되어야 함
    const ellipses = screen.getAllByText("⋯");
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it("첫 페이지로 버튼 클릭 시 1페이지로 이동", () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "첫 페이지로" }));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it("마지막 페이지로 버튼 클릭 시 마지막 페이지로 이동", () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "마지막 페이지로" }));
    expect(mockOnPageChange).toHaveBeenCalledWith(10);
  });
});
