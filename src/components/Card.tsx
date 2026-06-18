import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glass?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  glass = true,
}) => {
  const isClickable = !!onClick;
  const classes = `rounded-2xl overflow-hidden p-6 border ${
    glass 
      ? 'glass-card' 
      : 'bg-white border-slate-200/50 dark:bg-dark-900 dark:border-dark-800/80 shadow-sm'
  } ${isClickable ? 'cursor-pointer' : ''} ${className}`;

  if (hoverable || isClickable) {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={onClick}
        className={classes}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={classes}>{children}</div>;
};

export default Card;
