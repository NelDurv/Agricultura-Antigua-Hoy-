import React from 'react';
import type { Widget } from '../../../core/engine';
import GlossaryWidget from './GlossaryWidget';
import ProgressWidget from './ProgressWidget';
import RelatedContentWidget from './RelatedContentWidget';
import CalculatorWidget from './CalculatorWidget';

export default function WidgetSlot({ widget }: { widget: Widget }) {
  switch (widget.type) {
    case 'glossary':
      return <GlossaryWidget widget={widget} />;
    case 'progress':
      return <ProgressWidget widget={widget} />;
    case 'related':
      return <RelatedContentWidget widget={widget} />;
    case 'calculator':
      return <CalculatorWidget widget={widget} />;
    default:
      return null;
  }
}
