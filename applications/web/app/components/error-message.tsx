interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm"
    >
      {message}
    </div>
  );
}
