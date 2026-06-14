export default function Button({
  children,
  variant = 'gold',
  size = '',
  className = '',
  type = 'button',
  onClick,
  style,
  ...props
}) {
  const classes = ['btn', `btn-${variant}`, size === 'lg' ? 'btn-lg' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} onClick={onClick} style={style} {...props}>
      {children}
    </button>
  );
}
