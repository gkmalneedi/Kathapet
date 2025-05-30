import { Card } from "@/components/ui/card";

interface AdSpaceProps {
  size?: "banner" | "square" | "rectangle";
  className?: string;
}

export function AdSpace({ size = "banner", className = "" }: AdSpaceProps) {
  const dimensions = {
    banner: "728 x 90",
    square: "300 x 300", 
    rectangle: "300 x 250"
  };

  const heightClass = {
    banner: "h-24",
    square: "h-80",
    rectangle: "h-64"
  };

  return (
    <Card className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${heightClass[size]} ${className}`}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Advertisement Space</p>
        <p className="text-sm text-gray-400">{dimensions[size]} Banner Ad</p>
      </div>
    </Card>
  );
}
