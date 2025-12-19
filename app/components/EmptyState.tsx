"use client";

interface EmptyStateProps {
  message?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

function XCircleIcon() {
  return (
    <svg width="47" height="47" viewBox="0 0 47 47" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.526 10.327C18.556 11.462 16.9 13.093 15.719 15.055C14.538 17.018 13.876 19.244 13.798 21.516C13.72 23.788 14.228 26.052 15.272 28.086C16.316 30.12 17.859 31.854 19.754 33.113C21.649 34.372 23.831 35.111 26.098 35.258C28.365 35.405 30.635 34.955 32.683 33.953C34.731 32.951 36.488 31.432 37.787 29.538C39.086 27.644 39.881 25.438 40.096 23.136L40.107 22.693L40.096 22.25C40.023 19.979 39.372 17.764 38.203 15.812C37.034 13.86 35.386 12.233 33.415 11.08C31.444 9.927 29.21 9.285 26.921 9.212C24.632 9.139 22.362 9.637 20.32 10.663L20.526 10.327ZM22.527 19.334C22.801 19.171 23.124 19.114 23.437 19.173C23.75 19.232 24.03 19.404 24.225 19.655C24.42 19.906 24.517 20.22 24.497 20.538C24.477 20.856 24.342 21.156 24.117 21.381L21.77 23.728L24.117 26.075L24.275 26.258C24.516 26.571 24.631 26.964 24.596 27.358C24.561 27.752 24.378 28.119 24.084 28.387C23.79 28.655 23.405 28.803 23.009 28.801C22.613 28.799 22.23 28.648 21.938 28.377L19.591 26.03L17.244 28.377L17.061 28.52C16.748 28.761 16.355 28.876 15.961 28.841C15.567 28.806 15.2 28.623 14.932 28.329C14.664 28.035 14.516 27.65 14.518 27.254C14.52 26.858 14.671 26.475 14.942 26.183L17.289 23.836L14.942 21.489L14.799 21.306C14.558 20.993 14.443 20.6 14.478 20.206C14.513 19.812 14.696 19.445 14.99 19.177C15.284 18.909 15.669 18.761 16.065 18.763C16.461 18.765 16.844 18.916 17.136 19.187L19.483 21.534L21.83 19.187L22.013 19.044L22.527 19.334Z"
        fill="#D1D6DB"
      />
    </svg>
  );
}

export default function EmptyState({
  message = "검색조건에 해당되는 배우를 찾을 수 없습니다",
  buttonLabel = "조건 선택하기",
  onButtonClick,
}: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5">
      <div
        className="flex items-center justify-center mb-6"
        style={{
          width: "94px",
          height: "94px",
          borderRadius: "50%",
          backgroundColor: "#F2F4F6",
        }}
      >
        <XCircleIcon />
      </div>

      <p
        className="text-center text-[#4E5968] text-sm leading-relaxed mb-8"
        style={{ letterSpacing: "-0.02em", maxWidth: "280px" }}
      >
        {message.split("\n").map((line, index) => (
          <span key={index}>
            {line}
            {index < message.split("\n").length - 1 && <br />}
          </span>
        ))}
      </p>

      {buttonLabel && (
        <button
          onClick={onButtonClick}
          className="px-8 py-3 border border-[#D1D6DB] rounded-lg text-[#4E5968] text-sm font-medium hover:border-gray-400 transition-colors"
          style={{ letterSpacing: "-0.02em" }}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
