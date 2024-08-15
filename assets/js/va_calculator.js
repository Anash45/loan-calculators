function va_PMT(rate, nper, pv) {
    return (rate === 0) ? -(pv / nper) : -(rate * pv) / (1 - Math.pow(1 + rate, -nper));
}

function calculateVATotalPayment(pay_num, sched_pay, extra_pay, beg_bal) {
    if (pay_num !== "" && (sched_pay + extra_pay < beg_bal)) {
        return sched_pay + extra_pay;
    } else if (pay_num !== "") {
        return beg_bal;
    } else {
        return "";
    }
}

function calculateVAEndingBalance(pay_num, sched_pay, extra_pay, beg_bal, princ) {
    if (pay_num !== "" && (sched_pay + extra_pay < beg_bal)) {
        return beg_bal - princ;
    } else if (pay_num !== "") {
        return 0;
    } else {
        return "";
    }
}

function generateVALoanSchedule(va_start_date_of_loan, va_loan_amount, va_scheduled_payment, va_optional_extra_payments, va_mortgage_rate_inp, va_num_of_months) {
    // Clear any existing rows in the table body
    $('#va_payments_table tbody').empty();

    let current_date = new Date(va_start_date_of_loan);
    let balance = parseFloat(va_loan_amount);
    let scheduled_payment = parseFloat(va_scheduled_payment);
    let extra_payment = parseFloat(va_optional_extra_payments);
    let yearly_interest_rate = parseFloat(va_mortgage_rate_inp / 100);
    let loan_term_months = parseInt(va_num_of_months, 10);

    console.log(yearly_interest_rate);
    let monthly_interest_rate = yearly_interest_rate / 12;
    console.log(monthly_interest_rate);

    let i = 1;
    let total_interest_payments = 0;
    let total_extra_payments = 0;
    while (i <= loan_term_months) {

        if (i !== "" && (scheduled_payment + extra_payment < balance)) {
            extra_payment = extra_payment;
        } else if (i !== "" && (balance - scheduled_payment > 0)) {
            extra_payment = balance - scheduled_payment;
        } else if (i !== "") {
            extra_payment = 0;
        } else {
            extra_payment = "";
        }


        let total_payment = calculateVATotalPayment(i, scheduled_payment, extra_payment, balance);
        let interest_payment = balance * monthly_interest_rate;
        let principal_payment = total_payment - interest_payment;
        let ending_balance = calculateVAEndingBalance(i, scheduled_payment, extra_payment, balance, principal_payment);
        current_date.setMonth(current_date.getMonth() + 1);

        total_interest_payments += interest_payment;
        total_extra_payments += extra_payment;

        // Create a new row and append it to the table body
        $('#va_payments_table tbody').append(`
                <tr>
                    <td>${i}</td> <!-- PmtNo. -->
                    <td>${current_date.toLocaleDateString()}</td> <!-- Payment Date -->
                    <td>$ ${balance.toFixed(2)}</td> <!-- Beginning Balance -->
                    <td>$ ${scheduled_payment.toFixed(2)}</td> <!-- Scheduled Payment -->
                    <td>$ ${extra_payment.toFixed(2)}</td> <!-- Extra Payment -->
                    <td>$ ${total_payment.toFixed(2)}</td> <!-- Total Payment -->
                    <td>$ ${principal_payment.toFixed(2)}</td> <!-- Principal -->
                    <td>$ ${interest_payment.toFixed(2)}</td> <!-- Interest -->
                    <td>$ ${ending_balance.toFixed(2)}</td> <!-- Ending Balance -->
                </tr>
            `);

        // Update balance and date for the next iteration
        balance = ending_balance;
        if (balance <= 0) {
            break;
        }
        i++;
    }

    console.log(total_interest_payments);
    return [i, total_extra_payments, total_interest_payments];
}

function initVACalculations() {
    let va_sales_price_inp = parseFloat($('#va_sales_price_inp').val()) || 0;
    let va_est_dwn_pmt_inp = parseFloat($('#va_est_dwn_pmt_inp').val()) || 0;

    let va_est_dwn_pmt_amnt = 0;
    let va_est_dwn_pmt_rate = 0;
    if ($('[name="va_dwn_pmt_amnt"]:checked').val() == 'amount') {
        va_est_dwn_pmt_amnt = va_est_dwn_pmt_inp;
        va_est_dwn_pmt_rate = ((va_est_dwn_pmt_amnt / va_sales_price_inp) * 100) / 100;
    } else {
        va_est_dwn_pmt_rate = va_est_dwn_pmt_inp / 100;
        va_est_dwn_pmt_amnt = va_est_dwn_pmt_rate * va_sales_price_inp;
    }

    console.log('Rate Percent ', va_est_dwn_pmt_amnt, va_est_dwn_pmt_rate, va_sales_price_inp);
    let va_monthly_hoa_fee_inp = parseFloat($('#va_monthly_hoa_fee_inp').val()) || 0;
    let va_inspection_inp = parseFloat($('#va_inspection_inp').val()) || 0;
    let va_appraisal_inp = parseFloat($('#va_appraisal_inp').val()) || 0;
    let va_option_money_inp = parseFloat($('#va_option_money_inp').val()) || 0;
    let va_yearly_ins_inp = parseFloat($('#va_yearly_ins_inp').val()) || 0;
    let va_yearly_taxes_inp = parseFloat($('#va_yearly_taxes_inp').val()) || 0;
    let va_mortgage_years_inp = parseFloat($('#va_mortgage_years_inp').val()) || 0;
    let va_mortgage_rate_inp = parseFloat($('#va_mortgage_rate_inp').val()) || 0;
    let va_est_sbac_inp = parseFloat($('#va_est_sbac_inp').val()) || 0;
    let va_number_of_pmt_per_year_inp = parseFloat($('#va_number_of_pmt_per_year_inp').val()) || 0;
    let va_optional_extra_payments = parseFloat($('#va_optional_extra_payments').val()) || 0;
    let va_seller_paid_closing_costs_inp = parseFloat($('#va_seller_paid_closing_costs_inp').val()) || 0;
    let va_appraisal_gap_inp = parseFloat($('#va_appraisal_gap_inp').val()) || 0;
    let va_start_date_of_loan = $('#va_start_date_of_loan').val() || '01-01-2025';
    let va_funding_fee_type_inp = $('#va_funding_fee_type_inp').val();
    let va_funding_fee_inp = 0;

    if (va_funding_fee_type_inp == 'Not Disabled') {
        va_funding_fee_inp = 6000;
    } else {
        va_funding_fee_inp = 0;
    }

    $('#va_funding_fee_inp').val(va_funding_fee_inp);

    // Calculations
    let va_base_loan_amnt_inp = va_sales_price_inp - (va_sales_price_inp * (va_est_dwn_pmt_rate)) + va_funding_fee_inp;
    $('#va_base_loan_amnt_inp').val(va_base_loan_amnt_inp > 0 ? va_base_loan_amnt_inp.toFixed(2) : '');

    // $('#va_funding_fee_inp').val(va_funding_fee_inp > 0 ? va_funding_fee_inp.toFixed(2) : 0);

    let va_monthly_ins_inp = va_yearly_ins_inp / 12;
    $('#va_monthly_ins_inp').val(va_monthly_ins_inp > 0 ? va_monthly_ins_inp.toFixed(2) : '');

    let va_monthly_taxes_inp = va_yearly_taxes_inp / 12;
    $('#va_monthly_taxes_inp').val(va_monthly_taxes_inp > 0 ? va_monthly_taxes_inp.toFixed(2) : '');

    let va_loan_amount = va_sales_price_inp - (va_est_dwn_pmt_rate * va_sales_price_inp) + va_funding_fee_inp;
    $('#va_loan_amount').val(va_loan_amount.toFixed(2));
    let va_est_ttl_pmt_type = $('#va_est_ttl_pmt_type').val();


    $('#va_annual_interest_rate').val(va_mortgage_rate_inp.toFixed(2));
    $('#va_loan_period_in_years').val(va_mortgage_years_inp);


    let va_scheduled_payment = 0;
    let va_rate_per_month = (va_mortgage_rate_inp / va_number_of_pmt_per_year_inp) / 100;
    let va_num_of_months = va_mortgage_years_inp * va_number_of_pmt_per_year_inp;
    va_scheduled_payment = -va_PMT(va_rate_per_month, va_num_of_months, va_loan_amount);

    $('#va_scheduled_pmt').html(`$ ${va_scheduled_payment.toFixed(2)}`);


    let va_principle_interest_inp = va_scheduled_payment;
    $('#va_principle_interest_inp').val(va_principle_interest_inp.toFixed(2));

    let va_monthly_mip = 0;
    if (va_sales_price_inp !== 0) {
        if ((va_est_dwn_pmt_rate) < 0.2) {
            va_monthly_mip = va_principle_interest_inp * 0.085;
        }
    }
    $('#va_monthly_mip_inp').val(`${va_monthly_mip.toFixed(2)}`);

    let va_est_total_pmt = 0;
    if (va_est_ttl_pmt_type == 'Est Ttl Pmt_Escrows') {
        va_est_total_pmt = va_principle_interest_inp + va_monthly_ins_inp + va_monthly_taxes_inp + va_monthly_mip + va_monthly_hoa_fee_inp;
    } else {
        va_est_total_pmt = va_principle_interest_inp;
    }


    $('#va_est_total_pmt').html(`${va_est_total_pmt.toFixed(2)}`);

    let va_earnest_money = va_sales_price_inp * 0.01;
    $('#va_earnest_money_inp').val(`${va_earnest_money.toFixed(2)}`);

    let va_total_additional_costs = va_inspection_inp + va_appraisal_inp + va_earnest_money + va_option_money_inp;
    $('#va_total_additional_costs').html(`${va_total_additional_costs.toFixed(2)}`);

    let va_down_pmt_inp = va_sales_price_inp * va_est_dwn_pmt_rate;
    $('#va_down_pmt_inp').val(`${va_down_pmt_inp.toFixed(2)}`);

    $('#va_earnest_money').val(`${va_earnest_money.toFixed(2)}`);

    let va_buyer_dwn_pmt_cost_inp = va_down_pmt_inp - va_earnest_money;
    $('#va_buyer_dwn_pmt_cost_inp').val(`${va_buyer_dwn_pmt_cost_inp.toFixed(2)}`);

    let va_est_closing_costs_inp;
    if (va_sales_price_inp < 200000) {
        va_est_closing_costs_inp = va_loan_amount * 0.04;
    } else {
        va_est_closing_costs_inp = va_loan_amount * 0.035;
    }

    // Display the va_est_closing_costs_inp
    $('#va_est_closing_costs_inp').val(`${va_est_closing_costs_inp.toFixed(2)}`);

    let va_buyer_closing_costs_inp = va_est_closing_costs_inp - va_seller_paid_closing_costs_inp;
    $('#va_buyer_closing_costs_inp').val(`${va_buyer_closing_costs_inp.toFixed(2)}`);


    let va_sbac_amnt = 0;
    let va_sbac_rate = 0;
    if ($('[name="va_bac_toggle"]:checked').val() == 'amount') {
        va_sbac_amnt = va_est_sbac_inp;
        va_sbac_rate = ((va_sbac_amnt / va_sales_price_inp) * 100) / 100;
    } else {
        va_sbac_rate = va_est_sbac_inp / 100;
        va_sbac_amnt = va_sbac_rate * va_sales_price_inp;
    }

    let va_seller_agent_comp_offset_inp = va_sales_price_inp * va_sbac_rate;
    $('#va_seller_agent_comp_offset_inp').val(`${va_seller_agent_comp_offset_inp.toFixed(2)}`);




    let va_buyer_agent_comp_inp = $('#va_buyer_agent_comp_inp').val();

    let va_buyer_agent_comp_amnt = 0;
    let va_buyer_agent_comp_rate = 0;
    if ($('[name="va_buyer_agent_comp_toggle"]:checked').val() == 'amount') {
        va_buyer_agent_comp_amnt = va_buyer_agent_comp_inp;
        va_buyer_agent_comp_rate = ((va_buyer_agent_comp_amnt / va_sales_price_inp) * 100) / 100;
    } else {
        va_buyer_agent_comp_rate = va_buyer_agent_comp_inp / 100;
        va_buyer_agent_comp_amnt = va_buyer_agent_comp_rate * va_sales_price_inp;
    }

    console.log('Rate Amnt ', va_buyer_agent_comp_amnt);

    let va_agent_compensation_inp = (va_sales_price_inp === 0) ? 0 : (va_sales_price_inp * va_buyer_agent_comp_rate);
    // Display the va_agent_compensation_inp
    $('#va_agent_compensation_inp').val(`${va_agent_compensation_inp.toFixed(2)}`);

    let va_buyer_agent_comp_due_inp = va_agent_compensation_inp - va_seller_agent_comp_offset_inp;
    $('#va_buyer_agent_comp_due_inp').val(`${va_buyer_agent_comp_due_inp.toFixed(2)}`);

    let va_est_buyer_at_table_inp = va_buyer_dwn_pmt_cost_inp + va_buyer_closing_costs_inp + va_buyer_agent_comp_due_inp + va_appraisal_gap_inp;
    $('#va_est_buyer_at_table_inp').val(`${va_est_buyer_at_table_inp.toFixed(2)}`);

    let va_total_costs_w_gap_inp = va_est_buyer_at_table_inp + va_appraisal_gap_inp;
    $('#va_total_costs_w_gap_inp').val(`${va_total_costs_w_gap_inp.toFixed(2)}`);

    let va_reserves_cash_on_hand = 2 * va_est_total_pmt;
    $('#va_reserves_cash_on_hand').html(`${va_reserves_cash_on_hand.toFixed(2)}`);

    let va_scheduled_num_of_pmts = va_mortgage_years_inp * va_number_of_pmt_per_year_inp;
    $('#va_scheduled_num_of_pmts').html(`${va_scheduled_num_of_pmts.toFixed(0)}`);


    let fhaLoanSchedule = generateVALoanSchedule(va_start_date_of_loan, va_loan_amount, va_scheduled_payment, va_optional_extra_payments, va_mortgage_rate_inp, va_num_of_months);

    $('#va_actual_num_of_pmts').html(`${fhaLoanSchedule[0].toFixed(0)}`);
    $('#va_total_early_pmts').html(`$ ${fhaLoanSchedule[1].toFixed(2)}`);
    $('#va_total_interest').html(`$ ${fhaLoanSchedule[2].toFixed(2)}`);

    // generateVALoanSchedule(va_loan_start_date_inp, beginning_balance, scheduled_payment, extra_payment, interest_rate, loan_term_months);
    // console.log(va_loan_amount, va_est_dwn_pmt_inp, va_monthly_hoa_fee_inp, va_inspection_inp, va_appraisal_inp, va_option_money_inp, va_yearly_ins_inp, va_yearly_taxes_inp, va_mortgage_years_inp, va_mortgage_rate_inp, va_est_sbac_inp);
}

$(document).ready(function () {
    $('#va_form').on('input', function (e) {
        initVACalculations();
    });

    $('#va_form').on('submit', function (e) {
        e.preventDefault();
    });
    initVACalculations();
})