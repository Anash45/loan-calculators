function usda_PMT(rate, nper, pv) {
    return (rate === 0) ? -(pv / nper) : -(rate * pv) / (1 - Math.pow(1 + rate, -nper));
}

function calculateUsdaTotalPayment(pay_num, sched_pay, extra_pay, beg_bal) {
    if (pay_num !== "" && (sched_pay + extra_pay < beg_bal)) {
        return sched_pay + extra_pay;
    } else if (pay_num !== "") {
        return beg_bal;
    } else {
        return "";
    }
}

function calculateUsdaEndingBalance(pay_num, sched_pay, extra_pay, beg_bal, princ) {
    if (pay_num !== "" && (sched_pay + extra_pay < beg_bal)) {
        return beg_bal - princ;
    } else if (pay_num !== "") {
        return 0;
    } else {
        return "";
    }
}

function generateUsdaLoanSchedule(usda_start_date_of_loan, usda_loan_amount, usda_scheduled_payment, usda_optional_extra_payments, usda_mortgage_rate_inp, usda_num_of_months) {
    // Clear any existing rows in the table body
    $('#usda_payments_table tbody').empty();

    let current_date = new Date(usda_start_date_of_loan);
    let balance = parseFloat(usda_loan_amount);
    let scheduled_payment = parseFloat(usda_scheduled_payment);
    let extra_payment = parseFloat(usda_optional_extra_payments);
    let yearly_interest_rate = parseFloat(usda_mortgage_rate_inp / 100);
    let loan_term_months = parseInt(usda_num_of_months, 10);

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


        let total_payment = calculateUsdaTotalPayment(i, scheduled_payment, extra_payment, balance);
        let interest_payment = balance * monthly_interest_rate;
        let principal_payment = total_payment - interest_payment;
        let ending_balance = calculateUsdaEndingBalance(i, scheduled_payment, extra_payment, balance, principal_payment);
        current_date.setMonth(current_date.getMonth() + 1);

        total_interest_payments += interest_payment;
        total_extra_payments += extra_payment;

        // Create a new row and append it to the table body
        $('#usda_payments_table tbody').append(`
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

function initUsdaCalculations() {
    let usda_sales_price_inp = parseFloat($('#usda_sales_price_inp').val()) || 0;
    let usda_est_dwn_pmt_inp = parseFloat($('#usda_est_dwn_pmt_inp').val()) || 0;

    let usda_est_dwn_pmt_amnt = 0;
    let usda_est_dwn_pmt_rate = 0;
    if ($('[name="usda_dwn_pmt_amnt"]:checked').val() == 'amount') {
        usda_est_dwn_pmt_amnt = usda_est_dwn_pmt_inp;
        usda_est_dwn_pmt_rate = ((usda_est_dwn_pmt_amnt / usda_sales_price_inp) * 100) / 100;
    } else {
        usda_est_dwn_pmt_rate = usda_est_dwn_pmt_inp / 100;
        usda_est_dwn_pmt_amnt = usda_est_dwn_pmt_rate * usda_sales_price_inp;
    }

    console.log('Rate Percent ', usda_est_dwn_pmt_amnt, usda_est_dwn_pmt_rate, usda_sales_price_inp);
    let usda_monthly_tc_fee_inp = parseFloat($('#usda_monthly_tc_fee_inp').val()) || 0;
    let usda_inspection_inp = parseFloat($('#usda_inspection_inp').val()) || 0;
    let usda_appraisal_inp = parseFloat($('#usda_appraisal_inp').val()) || 0;
    let usda_option_money_inp = parseFloat($('#usda_option_money_inp').val()) || 0;
    let usda_yearly_ins_inp = parseFloat($('#usda_yearly_ins_inp').val()) || 0;
    let usda_yearly_taxes_inp = parseFloat($('#usda_yearly_taxes_inp').val()) || 0;
    let usda_mortgage_years_inp = parseFloat($('#usda_mortgage_years_inp').val()) || 0;
    let usda_mortgage_rate_inp = parseFloat($('#usda_mortgage_rate_inp').val()) || 0;
    let usda_est_sbac_inp = parseFloat($('#usda_est_sbac_inp').val()) || 0;
    let usda_number_of_pmt_per_year_inp = parseFloat($('#usda_number_of_pmt_per_year_inp').val()) || 0;
    let usda_optional_extra_payments = parseFloat($('#usda_optional_extra_payments').val()) || 0;
    let usda_seller_paid_closing_costs_inp = parseFloat($('#usda_seller_paid_closing_costs_inp').val()) || 0;
    let usda_appraisal_gap_inp = parseFloat($('#usda_appraisal_gap_inp').val()) || 0;
    let usda_start_date_of_loan = $('#usda_start_date_of_loan').val() || '01-01-2025';
    let usda_est_ttl_pmt_type = $('#usda_est_ttl_pmt_type').val();

    console.log(usda_est_ttl_pmt_type);
    // Calculations
    let usda_base_loan_amnt_inp = usda_sales_price_inp - (usda_sales_price_inp * (usda_est_dwn_pmt_rate));
    $('#usda_base_loan_amnt_inp').val(usda_base_loan_amnt_inp > 0 ? usda_base_loan_amnt_inp.toFixed(2) : '');

    // $('#usda_funding_fee_inp').val(usda_funding_fee_inp > 0 ? usda_funding_fee_inp.toFixed(2) : 0);

    let usda_monthly_ins_inp = usda_yearly_ins_inp / 12;
    $('#usda_monthly_ins_inp').val(usda_monthly_ins_inp > 0 ? usda_monthly_ins_inp.toFixed(2) : '');

    let usda_monthly_taxes_inp = usda_yearly_taxes_inp / 12;
    $('#usda_monthly_taxes_inp').val(usda_monthly_taxes_inp > 0 ? usda_monthly_taxes_inp.toFixed(2) : '');

    let usda_loan_amount = usda_sales_price_inp - (usda_est_dwn_pmt_rate * usda_sales_price_inp);

    let usda_funding_fee_inp = usda_loan_amount * 0.01;
    $('#usda_funding_fee_inp').val(usda_funding_fee_inp.toFixed(2));


    let usda_total_loan_amount_inp = usda_base_loan_amnt_inp + usda_funding_fee_inp;
    $('#usda_total_loan_amount_inp').val(usda_total_loan_amount_inp.toFixed(2));
    $('#usda_loan_amount').val(usda_total_loan_amount_inp.toFixed(2));


    let usda_monthly_fee_inp = 0;

    usda_monthly_fee_inp = (usda_sales_price_inp * 0.0035) / 12;

    $('#usda_monthly_fee_inp').val(usda_monthly_fee_inp.toFixed(2));

    $('#usda_annual_interest_rate').val(usda_mortgage_rate_inp.toFixed(2));
    $('#usda_loan_period_in_years').val(usda_mortgage_years_inp);


    let usda_scheduled_payment = 0;
    let usda_rate_per_month = (usda_mortgage_rate_inp / usda_number_of_pmt_per_year_inp) / 100;
    let usda_num_of_months = usda_mortgage_years_inp * usda_number_of_pmt_per_year_inp;
    usda_scheduled_payment = -usda_PMT(usda_rate_per_month, usda_num_of_months, usda_total_loan_amount_inp);

    $('#usda_scheduled_pmt').html(`$ ${usda_scheduled_payment.toFixed(2)}`);


    let usda_principle_interest_inp = usda_scheduled_payment;
    $('#usda_principle_interest_inp').val(usda_principle_interest_inp.toFixed(2));

    let usda_monthly_mip = 0;
    if (usda_sales_price_inp !== 0) {
        if ((usda_est_dwn_pmt_rate) < 0.2) {
            usda_monthly_mip = usda_principle_interest_inp * 0.085;
        }
    }
    $('#usda_monthly_mip_inp').val(`${usda_monthly_mip.toFixed(2)}`);


    let usda_est_total_pmt = 0;
    if (usda_est_ttl_pmt_type == 'Est Ttl Pmt_Escrows') {
        usda_est_total_pmt = usda_principle_interest_inp + usda_monthly_ins_inp + usda_monthly_taxes_inp + usda_monthly_fee_inp + usda_monthly_tc_fee_inp;
    } else {
        usda_est_total_pmt = usda_principle_interest_inp + usda_monthly_fee_inp;
    }
    $('#usda_est_total_pmt').html(`${usda_est_total_pmt.toFixed(2)}`);

    let usda_earnest_money = usda_sales_price_inp * 0.01;
    $('#usda_earnest_money_inp').val(`${usda_earnest_money.toFixed(2)}`);

    let usda_total_additional_costs = usda_inspection_inp + usda_appraisal_inp + usda_earnest_money + usda_option_money_inp;
    $('#usda_total_additional_costs').html(`${usda_total_additional_costs.toFixed(2)}`);

    let usda_down_pmt_inp = usda_sales_price_inp * usda_est_dwn_pmt_rate;
    $('#usda_down_pmt_inp').val(`${usda_down_pmt_inp.toFixed(2)}`);

    $('#usda_earnest_money').val(`${usda_earnest_money.toFixed(2)}`);

    let usda_buyer_dwn_pmt_cost_inp = usda_down_pmt_inp - usda_earnest_money;
    $('#usda_buyer_dwn_pmt_cost_inp').val(`${usda_buyer_dwn_pmt_cost_inp.toFixed(2)}`);

    let usda_est_closing_costs_inp;
    if (usda_sales_price_inp < 200000) {
        usda_est_closing_costs_inp = usda_total_loan_amount_inp * 0.04;
    } else {
        usda_est_closing_costs_inp = usda_total_loan_amount_inp * 0.035;
    }

    // Display the usda_est_closing_costs_inp
    $('#usda_est_closing_costs_inp').val(`${usda_est_closing_costs_inp.toFixed(2)}`);

    let usda_buyer_closing_costs_inp = usda_est_closing_costs_inp - usda_seller_paid_closing_costs_inp;
    $('#usda_buyer_closing_costs_inp').val(`${usda_buyer_closing_costs_inp.toFixed(2)}`);


    let usda_sbac_amnt = 0;
    let usda_sbac_rate = 0;
    if ($('[name="usda_bac_toggle"]:checked').val() == 'amount') {
        usda_sbac_amnt = usda_est_sbac_inp;
        usda_sbac_rate = ((usda_sbac_amnt / usda_sales_price_inp) * 100) / 100;
    } else {
        usda_sbac_rate = usda_est_sbac_inp / 100;
        usda_sbac_amnt = usda_sbac_rate * usda_sales_price_inp;
    }

    let usda_seller_agent_comp_offset_inp = usda_sales_price_inp * usda_sbac_rate;
    $('#usda_seller_agent_comp_offset_inp').val(`${usda_seller_agent_comp_offset_inp.toFixed(2)}`);


    let usda_buyer_agent_comp_inp = $('#usda_buyer_agent_comp_inp').val();

    let usda_buyer_agent_comp_amnt = 0;
    let usda_buyer_agent_comp_rate = 0;
    if ($('[name="usda_buyer_agent_comp_toggle"]:checked').val() == 'amount') {
        usda_buyer_agent_comp_amnt = usda_buyer_agent_comp_inp;
        usda_buyer_agent_comp_rate = ((usda_buyer_agent_comp_amnt / usda_sales_price_inp) * 100) / 100;
    } else {
        usda_buyer_agent_comp_rate = usda_buyer_agent_comp_inp / 100;
        usda_buyer_agent_comp_amnt = usda_buyer_agent_comp_rate * usda_sales_price_inp;
    }


    let usda_agent_compensation_inp = (usda_sales_price_inp === 0) ? 0 : (usda_sales_price_inp * usda_buyer_agent_comp_rate);
    // Display the usda_agent_compensation_inp
    $('#usda_agent_compensation_inp').val(`${usda_agent_compensation_inp.toFixed(2)}`);

    let usda_buyer_agent_comp_due_inp = usda_agent_compensation_inp - usda_seller_agent_comp_offset_inp;
    $('#usda_buyer_agent_comp_due_inp').val(`${usda_buyer_agent_comp_due_inp.toFixed(2)}`);


    let usda_est_buyer_at_table_inp = 0;
    usda_est_buyer_at_table_inp = usda_buyer_dwn_pmt_cost_inp + usda_buyer_closing_costs_inp + usda_appraisal_gap_inp + usda_buyer_agent_comp_due_inp;
    $('#usda_est_buyer_at_table_inp').val(`${usda_est_buyer_at_table_inp.toFixed(2)}`);

    let usda_total_costs_w_gap_inp = usda_est_buyer_at_table_inp + usda_appraisal_gap_inp;
    $('#usda_total_costs_w_gap_inp').val(`${usda_total_costs_w_gap_inp.toFixed(2)}`);

    let usda_reserves_cash_on_hand = 2 * usda_est_total_pmt;
    $('#usda_reserves_cash_on_hand').html(`${usda_reserves_cash_on_hand.toFixed(2)}`);

    let usda_scheduled_num_of_pmts = usda_mortgage_years_inp * usda_number_of_pmt_per_year_inp;
    $('#usda_scheduled_num_of_pmts').html(`${usda_scheduled_num_of_pmts.toFixed(0)}`);


    let fhaLoanSchedule = generateUsdaLoanSchedule(usda_start_date_of_loan, usda_total_loan_amount_inp, usda_scheduled_payment, usda_optional_extra_payments, usda_mortgage_rate_inp, usda_num_of_months);

    $('#usda_actual_num_of_pmts').html(`${fhaLoanSchedule[0].toFixed(0)}`);
    $('#usda_total_early_pmts').html(`$ ${fhaLoanSchedule[1].toFixed(2)}`);
    $('#usda_total_interest').html(`$ ${fhaLoanSchedule[2].toFixed(2)}`);

    // generateUsdaLoanSchedule(usda_loan_start_date_inp, beginning_balance, scheduled_payment, extra_payment, interest_rate, loan_term_months);
    // console.log(usda_loan_amount, usda_est_dwn_pmt_inp, usda_monthly_tc_fee_inp, usda_inspection_inp, usda_appraisal_inp, usda_option_money_inp, usda_yearly_ins_inp, usda_yearly_taxes_inp, usda_mortgage_years_inp, usda_mortgage_rate_inp, usda_est_sbac_inp);
}

$(document).ready(function () {
    $('#usda_form').on('input', function (e) {
        initUsdaCalculations();
    });

    $('#usda_form').on('submit', function (e) {
        e.preventDefault();
    });
    initUsdaCalculations();
})