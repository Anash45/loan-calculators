function conv_PMT(rate, nper, pv) {
    return (rate === 0) ? -(pv / nper) : -(rate * pv) / (1 - Math.pow(1 + rate, -nper));
}

function calculateConvTotalPayment(pay_num, sched_pay, extra_pay, beg_bal) {
    if (pay_num !== "" && (sched_pay + extra_pay < beg_bal)) {
        return sched_pay + extra_pay;
    } else if (pay_num !== "") {
        return beg_bal;
    } else {
        return "";
    }
}

function calculateConvEndingBalance(pay_num, sched_pay, extra_pay, beg_bal, princ) {
    if (pay_num !== "" && (sched_pay + extra_pay < beg_bal)) {
        return beg_bal - princ;
    } else if (pay_num !== "") {
        return 0;
    } else {
        return "";
    }
}

function generateConvLoanSchedule(conv_start_date_of_loan, conv_loan_amount, conv_scheduled_payment, conv_optional_extra_payments, conv_mortgage_rate_inp, conv_num_of_months) {
    // Clear any existing rows in the table body
    $('#conv_payments_table tbody').empty();

    let current_date = new Date(conv_start_date_of_loan);
    let balance = parseFloat(conv_loan_amount);
    let scheduled_payment = parseFloat(conv_scheduled_payment);
    let extra_payment = parseFloat(conv_optional_extra_payments);
    let yearly_interest_rate = parseFloat(conv_mortgage_rate_inp / 100);
    let loan_term_months = parseInt(conv_num_of_months, 10);

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


        let total_payment = calculateConvTotalPayment(i, scheduled_payment, extra_payment, balance);
        let interest_payment = balance * monthly_interest_rate;
        let principal_payment = total_payment - interest_payment;
        let ending_balance = calculateConvEndingBalance(i, scheduled_payment, extra_payment, balance, principal_payment);
        current_date.setMonth(current_date.getMonth() + 1);

        total_interest_payments += interest_payment;
        total_extra_payments += extra_payment;

        // Create a new row and append it to the table body
        $('#conv_payments_table tbody').append(`
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

function initConvCalculations() {
    let conv_sales_price_inp = parseFloat($('#conv_sales_price_inp').val()) || 0;
    let conv_est_dwn_pmt_inp = parseFloat($('#conv_est_dwn_pmt_inp').val()) || 0;

    let conv_est_dwn_pmt_amnt = 0;
    let conv_est_dwn_pmt_rate = 0;
    if ($('[name="conv_dwn_pmt_amnt"]:checked').val() == 'amount') {
        conv_est_dwn_pmt_amnt = conv_est_dwn_pmt_inp;
        conv_est_dwn_pmt_rate = ((conv_est_dwn_pmt_amnt / conv_sales_price_inp) * 100) / 100;
    } else {
        conv_est_dwn_pmt_rate = conv_est_dwn_pmt_inp / 100;
        conv_est_dwn_pmt_amnt = conv_est_dwn_pmt_rate * conv_sales_price_inp;
    }

    console.log('Rate Percent ', conv_est_dwn_pmt_amnt, conv_est_dwn_pmt_rate, conv_sales_price_inp);
    let conv_monthly_tc_fee_inp = parseFloat($('#conv_monthly_tc_fee_inp').val()) || 0;
    let conv_inspection_inp = parseFloat($('#conv_inspection_inp').val()) || 0;
    let conv_appraisal_inp = parseFloat($('#conv_appraisal_inp').val()) || 0;
    let conv_option_money_inp = parseFloat($('#conv_option_money_inp').val()) || 0;
    let conv_yearly_ins_inp = parseFloat($('#conv_yearly_ins_inp').val()) || 0;
    let conv_yearly_taxes_inp = parseFloat($('#conv_yearly_taxes_inp').val()) || 0;
    let conv_mortgage_years_inp = parseFloat($('#conv_mortgage_years_inp').val()) || 0;
    let conv_mortgage_rate_inp = parseFloat($('#conv_mortgage_rate_inp').val()) || 0;
    let conv_est_sbac_inp = parseFloat($('#conv_est_sbac_inp').val()) || 0;
    let conv_number_of_pmt_per_year_inp = parseFloat($('#conv_number_of_pmt_per_year_inp').val()) || 0;
    let conv_optional_extra_payments = parseFloat($('#conv_optional_extra_payments').val()) || 0;
    let conv_seller_paid_closing_costs_inp = parseFloat($('#conv_seller_paid_closing_costs_inp').val()) || 0;
    let conv_appraisal_gap_inp = parseFloat($('#conv_appraisal_gap_inp').val()) || 0;
    let conv_start_date_of_loan = $('#conv_start_date_of_loan').val() || '01-01-2025';
    let conv_est_ttl_pmt_type = $('#conv_est_ttl_pmt_type').val();

    console.log(conv_est_ttl_pmt_type);
    // Calculations
    let conv_base_loan_amnt_inp = conv_sales_price_inp - (conv_sales_price_inp * (conv_est_dwn_pmt_rate));
    $('#conv_base_loan_amnt_inp').val(conv_base_loan_amnt_inp > 0 ? conv_base_loan_amnt_inp.toFixed(2) : '');

    // $('#conv_funding_fee_inp').val(conv_funding_fee_inp > 0 ? conv_funding_fee_inp.toFixed(2) : 0);

    let conv_monthly_ins_inp = conv_yearly_ins_inp / 12;
    $('#conv_monthly_ins_inp').val(conv_monthly_ins_inp > 0 ? conv_monthly_ins_inp.toFixed(2) : '');

    let conv_monthly_taxes_inp = conv_yearly_taxes_inp / 12;
    $('#conv_monthly_taxes_inp').val(conv_monthly_taxes_inp > 0 ? conv_monthly_taxes_inp.toFixed(2) : '');




    let conv_loan_amount = conv_sales_price_inp - (conv_est_dwn_pmt_rate * conv_sales_price_inp);
    $('#conv_loan_amount').val(conv_loan_amount.toFixed(2));


    let conv_monthly_pmi_inp = 0;

    if (conv_est_dwn_pmt_rate >= 0.2) {
        conv_monthly_pmi_inp = 0;
    } else {
        conv_monthly_pmi_inp = (conv_loan_amount * 0.005) / 12;
    }

    $('#conv_monthly_pmi_inp').val(conv_monthly_pmi_inp.toFixed(2));

    $('#conv_annual_interest_rate').val(conv_mortgage_rate_inp.toFixed(2));
    $('#conv_loan_period_in_years').val(conv_mortgage_years_inp);


    let conv_scheduled_payment = 0;
    let conv_rate_per_month = (conv_mortgage_rate_inp / conv_number_of_pmt_per_year_inp) / 100;
    let conv_num_of_months = conv_mortgage_years_inp * conv_number_of_pmt_per_year_inp;
    conv_scheduled_payment = -conv_PMT(conv_rate_per_month, conv_num_of_months, conv_loan_amount);

    $('#conv_scheduled_pmt').html(`$ ${conv_scheduled_payment.toFixed(2)}`);


    let conv_principle_interest_inp = conv_scheduled_payment;
    $('#conv_principle_interest_inp').val(conv_principle_interest_inp.toFixed(2));

    let conv_monthly_mip = 0;
    if (conv_sales_price_inp !== 0) {
        if ((conv_est_dwn_pmt_rate) < 0.2) {
            conv_monthly_mip = conv_principle_interest_inp * 0.085;
        }
    }
    $('#conv_monthly_mip_inp').val(`${conv_monthly_mip.toFixed(2)}`);


    let conv_est_total_pmt = 0;
    if (conv_est_ttl_pmt_type == 'Est Ttl Pmt_Escrows') {
        conv_est_total_pmt = conv_principle_interest_inp + conv_monthly_ins_inp + conv_monthly_taxes_inp + conv_monthly_pmi_inp + conv_monthly_tc_fee_inp;
    } else {
        conv_est_total_pmt = conv_principle_interest_inp;
    }
    $('#conv_est_total_pmt').html(`${conv_est_total_pmt.toFixed(2)}`);

    let conv_earnest_money = conv_sales_price_inp * 0.01;
    $('#conv_earnest_money_inp').val(`${conv_earnest_money.toFixed(2)}`);

    let conv_total_additional_costs = conv_inspection_inp + conv_appraisal_inp + conv_earnest_money + conv_option_money_inp;
    $('#conv_total_additional_costs').html(`${conv_total_additional_costs.toFixed(2)}`);

    let conv_down_pmt_inp = conv_sales_price_inp * conv_est_dwn_pmt_rate;
    $('#conv_down_pmt_inp').val(`${conv_down_pmt_inp.toFixed(2)}`);

    $('#conv_earnest_money').val(`${conv_earnest_money.toFixed(2)}`);

    let conv_buyer_dwn_pmt_cost_inp = conv_down_pmt_inp - conv_earnest_money;
    $('#conv_buyer_dwn_pmt_cost_inp').val(`${conv_buyer_dwn_pmt_cost_inp.toFixed(2)}`);

    let conv_est_closing_costs_inp;
    if (conv_sales_price_inp < 200000) {
        conv_est_closing_costs_inp = conv_loan_amount * 0.04;
    } else {
        conv_est_closing_costs_inp = conv_loan_amount * 0.035;
    }

    // Display the conv_est_closing_costs_inp
    $('#conv_est_closing_costs_inp').val(`${conv_est_closing_costs_inp.toFixed(2)}`);

    let conv_buyer_closing_costs_inp = conv_est_closing_costs_inp + conv_seller_paid_closing_costs_inp;
    $('#conv_buyer_closing_costs_inp').val(`${conv_buyer_closing_costs_inp.toFixed(2)}`);

    let conv_agent_compensation_inp = (conv_sales_price_inp === 0) ? 0 : (conv_sales_price_inp * 0.03);
    // Display the conv_agent_compensation_inp
    $('#conv_agent_compensation_inp').val(`${conv_agent_compensation_inp.toFixed(2)}`);

    let conv_seller_agent_comp_offset_inp = conv_sales_price_inp * conv_est_sbac_inp / 100;
    $('#conv_seller_agent_comp_offset_inp').val(`${conv_seller_agent_comp_offset_inp.toFixed(2)}`);

    let conv_buyer_agent_comp_due_inp = conv_agent_compensation_inp - conv_seller_agent_comp_offset_inp;
    $('#conv_buyer_agent_comp_due_inp').val(`${conv_buyer_agent_comp_due_inp.toFixed(2)}`);

    let conv_est_buyer_at_table_inp = conv_buyer_dwn_pmt_cost_inp + conv_buyer_closing_costs_inp;
    $('#conv_est_buyer_at_table_inp').val(`${conv_est_buyer_at_table_inp.toFixed(2)}`);

    let conv_total_costs_w_gap_inp = conv_est_buyer_at_table_inp + conv_appraisal_gap_inp;
    $('#conv_total_costs_w_gap_inp').val(`${conv_total_costs_w_gap_inp.toFixed(2)}`);

    let conv_reserves_cash_on_hand = 2 * conv_est_total_pmt;
    $('#conv_reserves_cash_on_hand').html(`${conv_reserves_cash_on_hand.toFixed(2)}`);

    let conv_scheduled_num_of_pmts = conv_mortgage_years_inp * conv_number_of_pmt_per_year_inp;
    $('#conv_scheduled_num_of_pmts').html(`${conv_scheduled_num_of_pmts.toFixed(0)}`);


    let fhaLoanSchedule = generateConvLoanSchedule(conv_start_date_of_loan, conv_loan_amount, conv_scheduled_payment, conv_optional_extra_payments, conv_mortgage_rate_inp, conv_num_of_months);

    $('#conv_actual_num_of_pmts').html(`${fhaLoanSchedule[0].toFixed(0)}`);
    $('#conv_total_early_pmts').html(`$ ${fhaLoanSchedule[1].toFixed(2)}`);
    $('#conv_total_interest').html(`$ ${fhaLoanSchedule[2].toFixed(2)}`);

    // generateConvLoanSchedule(conv_loan_start_date_inp, beginning_balance, scheduled_payment, extra_payment, interest_rate, loan_term_months);
    // console.log(conv_loan_amount, conv_est_dwn_pmt_inp, conv_monthly_tc_fee_inp, conv_inspection_inp, conv_appraisal_inp, conv_option_money_inp, conv_yearly_ins_inp, conv_yearly_taxes_inp, conv_mortgage_years_inp, conv_mortgage_rate_inp, conv_est_sbac_inp);
}

$(document).ready(function () {
    $('#conv_form').on('input', function (e) {
        initConvCalculations();
    });

    $('#conv_form').on('submit', function (e) {
        e.preventDefault();
    });
    initConvCalculations();
})