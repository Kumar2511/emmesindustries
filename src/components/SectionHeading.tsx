interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

const SectionHeading = ({ title, subtitle, light }: SectionHeadingProps) => (
  <div className="text-center mb-12">
    <h2 className={`text-3xl sm:text-4xl font-display font-bold ${light ? "text-primary-foreground" : "text-foreground"}`}>
      {title}
    </h2>
    <div className="w-20 h-1 mx-auto mt-3 rounded-full gradient-wood" />
    {subtitle && (
      <p className={`mt-4 max-w-2xl mx-auto ${light ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionHeading;
