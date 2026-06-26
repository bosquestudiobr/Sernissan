-- Corrige mojibake UTF-8 em app_options (seed da 0001 gravado com encoding incorreto).
-- Ex.: RelatÃ³rios -> Relatórios, CalibraÃ§Ã£o -> Calibração

update public.app_options
set label = convert_from(convert_to(label, 'LATIN1'), 'UTF8')
where label ~ '[ÃÂ]';

update public.app_options
set metadata = convert_from(convert_to(metadata::text, 'LATIN1'), 'UTF8')::jsonb
where metadata::text ~ '[ÃÂ]';
