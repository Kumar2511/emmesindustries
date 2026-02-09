import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

const SectionHeading = ({ title, subtitle, light }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    className="text-center mb-12"
  >
    <h2 className={`text-3xl sm:text-4xl font-display font-bold ${light ? "text-primary-foreground" : "text-foreground"}`}>
      {title}
    </h2>
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      className="w-20 h-1 mx-auto mt-3 rounded-full gradient-wood origin-center"
    />
    {subtitle && (
      <p className={`mt-4 max-w-2xl mx-auto ${light ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
        {subtitle}
      </p>
    )}
  </motion.div>
);

export default SectionHeading;
