const NoTickerFound = ({ name }: { name: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center text-center p-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
      <div>
        <p className="text-xl font-semibold text-gray-700 mb-2">No Company Data Found</p>
        <p className="text-gray-600">
          We couldn't find any public records or ticker data for <strong>{name}</strong>. This might be a new or private company.
        </p>
      </div>
    </div>
  );
};

export default NoTickerFound;
