const StarBorder = ({
  as: Component = "button",
  className = "",
  color = "white",
  speed = "6s",
  thickness = 1,
  children,
  disabled,
  ...rest
}) => {
  return (
    <Component 
      className={`relative inline-block overflow-hidden rounded-[20px] ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{
        padding: `${thickness}px`,
        ...rest.style
      }}
      disabled={disabled}
      {...rest}
    >
      {!disabled && (
        <>
          <div
            className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
            style={{
              background: `radial-gradient(circle, ${color}, transparent 10%)`,
              animationDuration: speed,
            }}
          ></div>
          <div
            className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
            style={{
              background: `radial-gradient(circle, ${color}, transparent 10%)`,
              animationDuration: speed,
            }}
          ></div>
        </>
      )}
      <div className="relative z-1 w-full h-full">
        {children}
      </div>
    </Component>
  );
};

export default StarBorder; 