function Fha_PMT(rate, nper, pv) {
    return (rate === 0) ? -(pv / nper) : -(rate * pv) / (1 - Math.pow(1 + rate, -nper));
}

function calculateFhaTotalPayment(pay_num, sched_pay, extra_pay, beg_bal) {
    if (pay_num !== "" && (sched_pay + extra_pay < beg_bal)) {
        return sched_pay + extra_pay;
    } else if (pay_num !== "") {
        return beg_bal;
    } else {
        return "";
    }
}

function calculateFhaEndingBalance(pay_num, sched_pay, extra_pay, beg_bal, princ) {
    if (pay_num !== "" && (sched_pay + extra_pay < beg_bal)) {
        return beg_bal - princ;
    } else if (pay_num !== "") {
        return 0;
    } else {
        return "";
    }
}

function generateFhaLoanSchedule(fha_start_date_of_loan, fha_loan_amount, fha_scheduled_payment, fha_optional_extra_payments, fha_mortgage_rate_inp, fha_num_of_months) {
    // Clear any existing rows in the table body
    $('#fha_payments_table tbody').empty();

    let current_date = new Date(fha_start_date_of_loan);
    let balance = parseFloat(fha_loan_amount);
    let scheduled_payment = parseFloat(fha_scheduled_payment);
    let extra_payment = parseFloat(fha_optional_extra_payments);
    let yearly_interest_rate = parseFloat(fha_mortgage_rate_inp / 100);
    let loan_term_months = parseInt(fha_num_of_months, 10);

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


        let total_payment = calculateFhaTotalPayment(i, scheduled_payment, extra_payment, balance);
        let interest_payment = balance * monthly_interest_rate;
        let principal_payment = total_payment - interest_payment;
        let ending_balance = calculateFhaEndingBalance(i, scheduled_payment, extra_payment, balance, principal_payment);
        current_date.setMonth(current_date.getMonth() + 1);

        total_interest_payments += interest_payment;
        total_extra_payments += extra_payment;

        // Create a new row and append it to the table body
        $('#fha_payments_table tbody').append(`
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

function initFHACalculations() {
    let fha_sales_price_inp = parseFloat($('#fha_sales_price_inp').val()) || 0;
    let fha_est_dwn_pmt_inp = parseFloat($('#fha_est_dwn_pmt_inp').val()) || 0;

    let fha_est_dwn_pmt_amnt = 0;
    let fha_est_dwn_pmt_rate = 0;
    console.log($('[name="fha_dwn_pmt_amnt"]:checked').val());
    if ($('[name="fha_dwn_pmt_amnt"]:checked').val() == 'amount') {
        fha_est_dwn_pmt_amnt = fha_est_dwn_pmt_inp;
        fha_est_dwn_pmt_rate = ((fha_est_dwn_pmt_amnt / fha_sales_price_inp) * 100) / 100;
    } else {
        fha_est_dwn_pmt_rate = fha_est_dwn_pmt_inp / 100;
        fha_est_dwn_pmt_amnt = fha_est_dwn_pmt_rate * fha_sales_price_inp;
    }

    let fha_monthly_hoa_fee_inp = parseFloat($('#fha_monthly_hoa_fee_inp').val()) || 0;
    let fha_inspection_inp = parseFloat($('#fha_inspection_inp').val()) || 0;
    let fha_appraisal_inp = parseFloat($('#fha_appraisal_inp').val()) || 0;
    let fha_option_money_inp = parseFloat($('#fha_option_money_inp').val()) || 0;
    let fha_yearly_ins_inp = parseFloat($('#fha_yearly_ins_inp').val()) || 0;
    let fha_yearly_taxes_inp = parseFloat($('#fha_yearly_taxes_inp').val()) || 0;
    let fha_mortgage_years_inp = parseFloat($('#fha_mortgage_years_inp').val()) || 0;
    let fha_mortgage_rate_inp = parseFloat($('#fha_mortgage_rate_inp').val()) || 0;
    let fha_est_sbac_inp = parseFloat($('#fha_est_sbac_inp').val()) || 0;
    let fha_number_of_pmt_per_year_inp = parseFloat($('#fha_number_of_pmt_per_year_inp').val()) || 0;
    let fha_optional_extra_payments = parseFloat($('#fha_optional_extra_payments').val()) || 0;
    let fha_seller_paid_closing_costs_inp = parseFloat($('#fha_seller_paid_closing_costs_inp').val()) || 0;
    let fha_appraisal_gap_inp = parseFloat($('#fha_appraisal_gap_inp').val()) || 0;
    let fha_start_date_of_loan = $('#fha_start_date_of_loan').val() || '01-01-2025';
    let fha_est_ttl_pmt_type = $('#fha_est_ttl_pmt_type').val();

    // Calculations
    let fha_base_loan_amnt_inp = fha_sales_price_inp - (fha_sales_price_inp * (fha_est_dwn_pmt_rate));
    $('#fha_base_loan_amnt_inp').val(fha_base_loan_amnt_inp > 0 ? fha_base_loan_amnt_inp.toFixed(2) : '');

    let fha_mip_loan_amnt_inp = (fha_est_dwn_pmt_rate) >= 0.2 ? 0 : fha_base_loan_amnt_inp * 1.0175;
    $('#fha_mip_loan_amnt_inp').val(fha_mip_loan_amnt_inp > 0 ? fha_mip_loan_amnt_inp.toFixed(2) : '');

    let fha_monthly_ins_inp = fha_yearly_ins_inp / 12;
    $('#fha_monthly_ins_inp').val(fha_monthly_ins_inp > 0 ? fha_monthly_ins_inp.toFixed(2) : '');

    let fha_monthly_taxes_inp = fha_yearly_taxes_inp / 12;
    $('#fha_monthly_taxes_inp').val(fha_monthly_taxes_inp > 0 ? fha_monthly_taxes_inp.toFixed(2) : '');

    let fha_loan_amount = fha_mip_loan_amnt_inp;
    $('#fha_loan_amount').val(fha_loan_amount.toFixed(2));


    $('#fha_annual_interest_rate').val(fha_mortgage_rate_inp.toFixed(2));
    $('#fha_loan_period_in_years').val(fha_mortgage_years_inp);


    let fha_scheduled_payment = 0;
    let fha_rate_per_month = (fha_mortgage_rate_inp / fha_number_of_pmt_per_year_inp) / 100;
    let fha_num_of_months = fha_mortgage_years_inp * fha_number_of_pmt_per_year_inp;
    fha_scheduled_payment = -Fha_PMT(fha_rate_per_month, fha_num_of_months, fha_loan_amount);

    $('#fha_scheduled_pmt').html(`$ ${fha_scheduled_payment.toFixed(2)}`);


    let fha_principle_interest_inp = fha_scheduled_payment;
    $('#fha_principle_interest_inp').val(fha_principle_interest_inp.toFixed(2));

    let fha_monthly_mip = 0;
    if (fha_sales_price_inp !== 0) {
        if ((fha_est_dwn_pmt_rate) < 0.2) {
            fha_monthly_mip = fha_principle_interest_inp * 0.085;
        }
    }
    $('#fha_monthly_mip_inp').val(`${fha_monthly_mip.toFixed(2)}`);

    let fha_est_total_pmt = 0;
    if (fha_est_ttl_pmt_type == 'Est Ttl Pmt_Escrows') {
        console.log('Est Ttl Pmt_Escrows');
        fha_est_total_pmt = fha_principle_interest_inp + fha_monthly_ins_inp + fha_monthly_taxes_inp + fha_monthly_mip + fha_monthly_hoa_fee_inp;
    } else {
        console.log('Est Ttl Pmt_No_Escrows');
        fha_est_total_pmt = fha_principle_interest_inp;
    }

    $('#fha_est_total_pmt').html(`${fha_est_total_pmt.toFixed(2)}`);

    let fha_earnest_money = fha_sales_price_inp * 0.01;
    $('#fha_earnest_money_inp').val(`${fha_earnest_money.toFixed(2)}`);

    let total_est_upfront_costs = fha_inspection_inp + fha_appraisal_inp + fha_earnest_money + fha_option_money_inp;
    $('#total_est_upfront_costs').html(`${total_est_upfront_costs.toFixed(2)}`);

    let fha_down_pmt_inp = fha_sales_price_inp * fha_est_dwn_pmt_rate;
    $('#fha_down_pmt_inp').val(`${fha_down_pmt_inp.toFixed(2)}`);

    $('#fha_earnest_money').val(`${fha_earnest_money.toFixed(2)}`);

    let fha_buyer_dwn_pmt_cost_inp = fha_down_pmt_inp - fha_earnest_money;
    $('#fha_buyer_dwn_pmt_cost_inp').val(`${fha_buyer_dwn_pmt_cost_inp.toFixed(2)}`);

    let fha_est_closing_costs_inp;
    if (fha_sales_price_inp < 200000) {
        fha_est_closing_costs_inp = fha_sales_price_inp * 0.04;
    } else {
        fha_est_closing_costs_inp = fha_sales_price_inp * 0.035;
    }

    // Display the fha_est_closing_costs_inp
    $('#fha_est_closing_costs_inp').val(`${fha_est_closing_costs_inp.toFixed(2)}`);

    let fha_buyer_closing_costs_inp = fha_est_closing_costs_inp - fha_seller_paid_closing_costs_inp;
    $('#fha_buyer_closing_costs_inp').val(`${fha_buyer_closing_costs_inp.toFixed(2)}`);



    let fha_sbac_amnt = 0;
    let fha_sbac_rate = 0;
    if ($('[name="fha_bac_toggle"]:checked').val() == 'amount') {
        fha_sbac_amnt = fha_est_sbac_inp;
        fha_sbac_rate = ((fha_sbac_amnt / fha_sales_price_inp) * 100) / 100;
    } else {
        fha_sbac_rate = fha_est_sbac_inp / 100;
        fha_sbac_amnt = fha_sbac_rate * fha_sales_price_inp;
    }

    let fha_seller_agent_comp_offset_inp = fha_sales_price_inp * fha_sbac_rate;
    $('#fha_seller_agent_comp_offset_inp').val(`${fha_seller_agent_comp_offset_inp.toFixed(2)}`);



    
    let fha_buyer_agent_comp_inp = $('#fha_buyer_agent_comp_inp').val();

    let fha_buyer_agent_comp_amnt = 0;
    let fha_buyer_agent_comp_rate = 0;
    if ($('[name="fha_buyer_agent_comp_toggle"]:checked').val() == 'amount') {
        fha_buyer_agent_comp_amnt = fha_buyer_agent_comp_inp;
        fha_buyer_agent_comp_rate = ((fha_buyer_agent_comp_amnt / fha_sales_price_inp) * 100) / 100;
    } else {
        fha_buyer_agent_comp_rate = fha_buyer_agent_comp_inp / 100;
        fha_buyer_agent_comp_amnt = fha_buyer_agent_comp_rate * fha_sales_price_inp;
    }


    let fha_agent_compensation_inp = (fha_sales_price_inp === 0) ? 0 : (fha_sales_price_inp * fha_buyer_agent_comp_rate);
    // Display the fha_agent_compensation_inp
    $('#fha_agent_compensation_inp').val(`${fha_agent_compensation_inp.toFixed(2)}`);

    let fha_buyer_agent_comp_due_inp = fha_agent_compensation_inp - fha_seller_agent_comp_offset_inp;
    $('#fha_buyer_agent_comp_due_inp').val(`${fha_buyer_agent_comp_due_inp.toFixed(2)}`);

    let fha_est_buyer_at_table_inp = fha_buyer_dwn_pmt_cost_inp + fha_buyer_agent_comp_due_inp + fha_buyer_closing_costs_inp + fha_appraisal_gap_inp;
    $('#fha_est_buyer_at_table_inp').val(`${fha_est_buyer_at_table_inp.toFixed(2)}`);

    let fha_total_costs_w_gap_inp = fha_est_buyer_at_table_inp + fha_appraisal_gap_inp;
    $('#fha_total_costs_w_gap_inp').val(`${fha_total_costs_w_gap_inp.toFixed(2)}`);

    let fha_reserves_cash_on_hand = 2 * fha_est_total_pmt;
    $('#fha_reserves_cash_on_hand').html(`${fha_reserves_cash_on_hand.toFixed(2)}`);

    let fha_scheduled_num_of_pmts = fha_mortgage_years_inp * fha_number_of_pmt_per_year_inp;
    $('#fha_scheduled_num_of_pmts').html(`${fha_scheduled_num_of_pmts.toFixed(0)}`);


    let fhaLoanSchedule = generateFhaLoanSchedule(fha_start_date_of_loan, fha_loan_amount, fha_scheduled_payment, fha_optional_extra_payments, fha_mortgage_rate_inp, fha_num_of_months);

    $('#fha_actual_num_of_pmts').html(`${fhaLoanSchedule[0].toFixed(0)}`);
    $('#fha_total_early_pmts').html(`$ ${fhaLoanSchedule[1].toFixed(2)}`);
    $('#fha_total_interest').html(`$ ${fhaLoanSchedule[2].toFixed(2)}`);

    // generateFhaLoanSchedule(fha_loan_start_date_inp, beginning_balance, scheduled_payment, extra_payment, interest_rate, loan_term_months);
    // console.log(fha_loan_amount, fha_est_dwn_pmt_inp, fha_monthly_hoa_fee_inp, fha_inspection_inp, fha_appraisal_inp, fha_option_money_inp, fha_yearly_ins_inp, fha_yearly_taxes_inp, fha_mortgage_years_inp, fha_mortgage_rate_inp, fha_est_sbac_inp);
}

$(document).ready(function () {
    $('#fha_form').on('input', function (e) {
        initFHACalculations();
    });

    $('#fha_form').on('submit', function (e) {
        e.preventDefault();
    });
    initFHACalculations();
})