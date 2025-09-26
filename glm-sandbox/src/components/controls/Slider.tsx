interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export const Slider = ({ label, value, min, max, step, onChange }: SliderProps) => {
  return (
    <div className="slider-container">
      <div className="flex justify-between items-center mb-1">
        <label className="slider-label">{label}</label>
        <span className="slider-value">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );
};
