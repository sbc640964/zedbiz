import Card from "@/Components/Widgets/Card";
import Icon from "@/Components/Icon";
import Button from "@/Components/Button";
import {currencies} from "@/helpers";

function NumberWidget({ setModal, value, label, icon, comparison, width, description, bg_color, className, iconInSIde, action, ...props }) {

    if(props.loading){
        return (
            <Card className={className}>
                <Card.Body>
                    <div className="flex items-center justify-center h-full">
                        <Icon icon="spinner" spin/>
                    </div>
                </Card.Body>
            </Card>
        )
    }

    const colorClass = color => ({
        'primary': 'text-primary-100 fill-primary-400, stroke-primary-300 bg-primary-50',
        'secondary': 'fill-secondary-100, stroke-secondary-400 text-secondary-100 bg-secondary-50',
        'success': 'fill-success-100, stroke-success-400 text-success-100 bg-success-50',
        'danger': 'fill-danger-100, stroke-danger-400 text-danger-100 bg-danger-50',
        'warning': 'fill-warning-100, stroke-warning-400 text-warning-100 bg-warning-50',
        'info': 'fill-info-100, stroke-info-400 text-info-100 bg-info-50',
    }[color]);

    const cardClasses = color => ({
        'primary': 'bg-primary-50',
        'secondary': 'bg-secondary-50',
        'success': 'bg-success-50',
        'danger': 'bg-danger-50',
        'warning': 'bg-warning-50',
        'info': 'bg-info-50',
    }[color]);

    /**
     * @param {object} value
     * @param {boolean|null} currencyCode
     * @returns {number|string}
     */
    const renderNumber = (value, currencyCode = null) => {

        let _ = Number(value.value ?? 0);

        switch (value.format){
            case 'currency':

                if(value.decimal_places) {
                    _ = _.toFixed(value.decimal_places);
                }

                const symbol = currencies.find(v => v.value === value.currency_code)?.symbol ?? '';

                if(currencyCode === true){
                    _ = symbol;
                }

                if(value.thousand_separator){
                    _ = (_ + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }

                if(currencyCode === null){
                    _ = value.currency_position ? `${symbol}${_}` : `${_}${symbol}`;
                }

                break;
            case 'percent':
                _ = Number((_ * 100)).toFixed(value.decimal_places ?? 0) + '%';
                break;
            case 'number':
                if(value.thousand_separator){
                    _ = (_ + '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }
                break;
        }

        if(value.trend_mode_enable){
            _ = _.replace('-', '');
        }

        _ = `${value.prefix ?? ''}${_}${value.suffix ?? ''}`;

        return _;
    }

    function getTrend(type, objectValue) {

        const isDown = renderNumber(objectValue).startsWith('-');

        const color = c => ({
            'success' : {bg: 'bg-success-50', text: 'text-success-600'},
            'danger' : {bg: 'bg-danger-50', text: 'text-danger-600'},
            'warning' : {bg: 'bg-warning-50', text: 'text-warning-600'},
            'info' : {bg: 'bg-info-50', text: 'text-info-600'},
            'primary' : {bg: 'bg-primary-50', text: 'text-primary-600'},
        }?.[c]);

        switch (type) {
            case 'text':
                return color(objectValue?.[isDown ? 'trend_color_negative' : 'trend_color_positive']).text;
            case 'bg':
                return color(objectValue?.[isDown ? 'trend_color_negative' : 'trend_color_positive']).bg;
            case 'icon':
                return isDown ? 'arrow-trending-down' : 'arrow-trending-up';
        }
    }

    return (
        <Card
            className={`${className ?? ''}`}
            classNameCard={cardClasses(bg_color)}
        >
            <Card.Header
                className="py-2 border-0 font-bold pb-0"
                settingsBtn={setModal}
                paths={props?.paths ?? []}
            >
                {label}
            </Card.Header>
            <Card.Body className="px-4">
                <div className={`flex ${iconInSIde ? 'items-center space-x-3 rtl:space-x-reverse' : 'flex-col'}`}>
                    <span className={`relative rounded-lg p-1.5 ${colorClass(icon.color)}`}>
                        <Icon name={icon.name} className={`h-10 w-10 stroke-[0.75] ${colorClass(icon.color)}`} type="outline"/>
                    </span>
                    <div className="flex flex-col items-start flex-grow">
                        <div className="flex space-x-2 rtl:space-x-reverse items-center">
                            <div className="text-3xl leading-none">
                                <span>{renderNumber(value).split('.')?.[0] ?? 0}</span>
                                {renderNumber(value).split('.')?.[1]&& <span className="text-zinc-400 font-normal text-base">.{renderNumber(value).split('.')?.[1]}</span>}
                            </div>
                            {comparison.value &&
                                <span className={`flex items-center space-x-0.5 p-0.5 px-1 rounded ${ comparison.trend_mode_enable ? getTrend('bg', comparison) : ''}`}>
                                    {comparison.trend_mode_enable &&
                                        <span className={`text-xs font-bold ${ getTrend('text', comparison) }`}>
                                            <Icon name={getTrend('icon', comparison)} className={`h-3.5 w-3.5 stroke-1.5`} type="outline"/>
                                        </span>
                                    }
                                    <span className={`text-xs font-bold ${ comparison.trend_mode_enable ? getTrend('text', comparison) : 'text-gray-400'}`}>{renderNumber(comparison)}</span>
                                </span>
                            }
                        </div>
                        {description &&
                            <div>
                                <div className="text-xs text-gray-400">{description}</div>
                            </div>
                        }
                    </div>
                    { action && <div className="h-full mt-auto">
                        <Button
                            iconBeforeLabel
                            negative
                            {...action}
                        />
                    </div>}
                </div>
            </Card.Body>
        </Card>
    )
}

export default NumberWidget
