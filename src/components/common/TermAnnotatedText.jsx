import { useMemo } from 'react';
import DictionaryTooltip from './DictionaryTooltip';
import { annotateTextByTerms } from '../../utils/bookTerms';

const TermAnnotatedText = ({ text, terms = [], className = '', as = 'span' }) => {
    const segments = useMemo(() => annotateTextByTerms(text, terms), [text, terms]);
    const Wrapper = as;

    return (
        <Wrapper className={className}>
            {segments.map((segment, index) => {
                if (!segment.match) return <span key={index}>{segment.text}</span>;

                return (
                    <DictionaryTooltip
                        key={index}
                        word={segment.text}
                        termId={segment.match.termId}
                        priority={segment.match.priority}
                    />
                );
            })}
        </Wrapper>
    );
};

export default TermAnnotatedText;
