const SpinnerLoader = ({ className = "" }) => {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
    </span>
  );
};

export default SpinnerLoader;