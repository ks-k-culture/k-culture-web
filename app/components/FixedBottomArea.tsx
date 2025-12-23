interface FixedBottomAreaProps {
  children: React.ReactNode;
}

export function FixedBottomArea({ children }: FixedBottomAreaProps) {
  return <div className="fixed bottom-0 left-0 right-0 bg-white px-5 py-6 max-w-lg mx-auto">{children}</div>;
}
