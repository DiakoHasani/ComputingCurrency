class ComputingCurrency {

    //تعداد اعداد اعشاری ارز
    decimalCurrencyLength = 6;
    constructor(amountInput, currencyInput, price) {
        this.amountInput = amountInput;
        this.currencyInput = currencyInput;
        this.price = price;
    }

    getDecimalCurrencyLength() {
        return this.decimalCurrencyLength;
    }

    setDecimalCurrencyLength(value) {
        this.decimalCurrencyLength = value;
    }

    getEnglishNumber(number) {
        let result = String(number);
        result = result.replace(/۱/g, '1');
        result = result.replace(/۲/g, '2');
        result = result.replace(/۳/g, '3');
        result = result.replace(/۴/g, '4');
        result = result.replace(/۵/g, '5');
        result = result.replace(/۶/g, '6');
        result = result.replace(/۷/g, '7');
        result = result.replace(/۸/g, '8');
        result = result.replace(/۹/g, '9');
        result = result.replace(/۰/g, '0');
        return result;
    }

    getPattern() {
        return "^\\d*(\\.\\d{0," + this.getDecimalCurrencyLength() + "})?$";
    }

    setCurrencyRegex() {
        let oldVal = this.getEnglishNumber(this.currencyInput.val());
        let regex = new RegExp(this.currencyInput.attr('pattern'), 'g');

        let self = this;
        setTimeout(function () {
            let newVal = self.getEnglishNumber(self.currencyInput.val());
            if (!regex.test(newVal)) {
                self.currencyInput.val(oldVal);
            }
        }, 0);
    }

    setAmountRegex() {
        let oldVal = this.getEnglishNumber(this.amountInput.val()).replace(/,/g, '');
        let regex = new RegExp(this.amountInput.attr('pattern'), 'g');

        let self = this;
        setTimeout(function () {
            var finalVal = '';
            var newVal = self.getEnglishNumber(self.amountInput.val()).replace(/,/g, '');
            if (!regex.test(newVal)) {
                finalVal = oldVal;
            } else {
                finalVal = newVal;
            }
            if (finalVal.includes(".")) {
                finalVal = finalVal.replace('.', '');
            }
            self.amountInput.val(finalVal);
        }, 0);
    }

    start() {
        this.currencyInput.attr('pattern', this.getPattern());
        this.amountInput.attr('pattern', this.getPattern());

        this.getCurrencyInputEvents();
        this.getAmountInputEvents();
    }

    separate(number) {
        number += '';
        number = number.replace(',', '');
        let x = number.split('.');
        let y = x[0];
        let z = x.length > 1 ? '.' + x[1] : '';
        let rgx = /(\d+)(\d{3})/;
        while (rgx.test(y))
            y = y.replace(rgx, '$1' + ',' + '$2');
        return y + z;
    }

    computCurrency() {
        let value = this.getEnglishNumber(this.currencyInput.val());
        value = value.replace(/\//g, '.');
        if (value == '') {
            this.currencyInput.val('');
            this.amountInput.val('');
        } else {
            let total = parseFloat(value) * parseFloat(this.price);
            if (!isNaN(total)) {
                this.currencyInput.val(value);
                this.amountInput.val(this.separate(parseInt(total)));
            }
        }
    }

    computAmount() {
        let value = this.getEnglishNumber(this.amountInput.val()).replace(/,/g, '');
        if (value == '') {
            this.amountInput.val('');
            this.currencyInput.val('');
        } else {
            let total = this.getEnglishNumber(parseFloat(value) / parseFloat(this.price));
            if (!isNaN(total)) {
                this.currencyInput.val(this.truncateToDecimals(total));
                this.amountInput.val(this.separate(value));
            }
        }
    }

    getCurrencyInputEvents() {
        let self = this;
        this.currencyInput.on('keydown', function () {
            self.setCurrencyRegex();
        });

        this.currencyInput.on('keyup', function () {
            self.computCurrency();
        });

        this.currencyInput.bind("paste cut", function (e) {
            setTimeout(function () {
                self.computCurrency();
            }, 0);
        });
    }

    getAmountInputEvents() {
        let self = this;
        this.amountInput.on('keydown', function () {
            self.setAmountRegex();
        });

        this.amountInput.on('keyup', function () {
            self.computAmount();
        });

        this.amountInput.bind("paste cut", function (e) {
            setTimeout(function () {
                self.computAmount();
            }, 0);
        });
    }

    truncateToDecimals(number) {
        const calcDec = Math.pow(10, this.getDecimalCurrencyLength());
        return Math.trunc(number * calcDec) / calcDec;
    }
}