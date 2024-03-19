$(document).ready(function () {

    fillform();
});

function fillform() {
    const schemeSelect = document.getElementById('schemeSelect');
    const schemeDetailForm = document.getElementById('schemeDetailForm');
    const formFields = schemeDetailForm.querySelectorAll('input, button');

    schemeSelect.addEventListener('change', () => {
        const schemeId = schemeSelect.value;
        if (schemeId) {
            // Fetch scheme details from the server
            fetch(`/imar/get-scheme-details/${schemeId}/`)
                .then(response => response.json())
                .then(data => {
                    populate_progress_table(data.progress_data)
                    scheme_detail = data.scheme_detail
                    const {
                        scheme_name,
                        completion_date,
                        gestation_start_date,
                        gestation_end_date,
                        approved_cost,
                        upload_pc1_pdf,
                        upload_pc1_word,
                        upload_revised_pc1_pdf,
                        upload_revised_pc1_word,
                        ddsc_date,
                        upload_ddsc_meeting_notice,
                        ddsc_mom_issue_date,
                        upload_ddsc_mom,
                        revised_ddsc_date,
                        revised_upload_ddsc_meeting_notice,
                        revised_ddsc_mom_issue_date,
                        upload_revised_ddsc_mom,
                        approval_status,
                        aa_date,
                        upload_aa,
                        tendered_date,
                        award_date,
                        company_name
                    } = scheme_detail;
                    // document.getElementById('schemeName').value = scheme_name;
                    document.getElementById('completionDate').value = completion_date;
                    document.getElementById('gestationStartDate').value = gestation_start_date;
                    document.getElementById('gestationEndDate').value = gestation_end_date;
                    document.getElementById('approvedCost').value = approved_cost;
                    document.getElementById('uploadPc1Pdf').href = upload_pc1_pdf ? upload_pc1_pdf : '#'
                    // document.getElementById('uploadPc1Pdf').innerHTML = upload_pc1_pdf ? `<a href="${upload_pc1_pdf}" target="_blank">View File</a>` : '';
                    document.getElementById('uploadPc1Word').href = upload_pc1_word ? upload_pc1_word : '#';
                    document.getElementById('uploadRevisedPc1Pdf').href = upload_revised_pc1_pdf ? upload_revised_pc1_pdf : '#';
                    document.getElementById('uploadRevisedPc1Word').href = upload_revised_pc1_word ? upload_revised_pc1_word : '#';
                    document.getElementById('ddscDate').value = ddsc_date;
                    document.getElementById('uploadDdscMeetingNotice').href = upload_ddsc_meeting_notice ? upload_ddsc_meeting_notice : '#';
                    document.getElementById('ddscMomIssueDate').value = ddsc_mom_issue_date;
                    document.getElementById('uploadDdscMom').href = upload_ddsc_mom ? upload_ddsc_mom : '#';
                    document.getElementById('revisedDdscDate').value = revised_ddsc_date;
                    document.getElementById('revisedUploadDdscMeetingNotice').href = revised_upload_ddsc_meeting_notice ? revised_upload_ddsc_meeting_notice : '#';
                    document.getElementById('revisedDdscMomIssueDate').value = revised_ddsc_mom_issue_date;
                    document.getElementById('uploadRevisedDdscMom').href = upload_revised_ddsc_mom ? upload_revised_ddsc_mom : '#';
                    document.getElementById('approvalStatus').value = approval_status ? 'Approved' : 'Not Approved';
                    document.getElementById('aaDate').value = aa_date;
                    document.getElementById('uploadAa').href = upload_aa ? upload_aa : '#';
                    document.getElementById('tenderedDate').value = tendered_date;
                    document.getElementById('awardDate').value = award_date;
                    document.getElementById('companyName').value = company_name;
                    // formFields.forEach(field => field.disabled = false);
                })
                .catch(error => console.error('Error:', error));
        } else {
            formFields.forEach(field => {
                field.value = '';
                field.disabled = true;
            });
        }
    });
}

function populate_progress_table(data) {
    data.forEach(progress => {
        // Create table row
        const row = document.createElement("tr");

        // Create table cells for each field
        const dateCell = document.createElement("td");
        dateCell.textContent = progress.physical_progress_date;
        row.appendChild(dateCell);

        const remarksCell = document.createElement("td");
        remarksCell.textContent = progress.physical_progress_remarks;
        row.appendChild(remarksCell);

        // Append the row to the table body
        document.getElementById("progressTableBody").appendChild(row);
    });
}