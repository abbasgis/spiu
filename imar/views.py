from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.template import loader

from imar.models import SchemeDetail, PhysicalProgress


# Create your views here.
def imar_page(request):
    template = loader.get_template('imar.html')
    schemes = SchemeDetail.objects.all()
    return HttpResponse(template.render({'schemes': schemes}, request))


def get_scheme_details(request, scheme_id):
    scheme = get_object_or_404(SchemeDetail, id=scheme_id)
    data = {
        'scheme_name': scheme.scheme_name,
        'completion_date': scheme.completion_date.strftime('%Y-%m-%d') if scheme.completion_date else '',
        'gestation_start_date': scheme.gestation_start_date.strftime('%Y-%m-%d') if scheme.gestation_start_date else '',
        'gestation_end_date': scheme.gestation_end_date.strftime('%Y-%m-%d') if scheme.gestation_end_date else '',
        'approved_cost': scheme.approved_cost,
        'upload_pc1_pdf': scheme.upload_pc1_pdf.url if scheme.upload_pc1_pdf else '',
        'upload_pc1_word': scheme.upload_pc1_word.url if scheme.upload_pc1_word else '',
        'upload_revised_pc1_pdf': scheme.upload_revised_pc1_pdf.url if scheme.upload_revised_pc1_pdf else '',
        'upload_revised_pc1_word': scheme.upload_revised_pc1_word.url if scheme.upload_revised_pc1_word else '',
        'ddsc_date': scheme.ddsc_date.strftime('%Y-%m-%d') if scheme.ddsc_date else '',
        'upload_ddsc_meeting_notice': scheme.upload_ddsc_meeting_notice.url if scheme.upload_ddsc_meeting_notice else '',
        'ddsc_mom_issue_date': scheme.ddsc_mom_issue_date.strftime('%Y-%m-%d') if scheme.ddsc_mom_issue_date else '',
        'upload_ddsc_mom': scheme.upload_ddsc_mom.url if scheme.upload_ddsc_mom else '',
        'revised_ddsc_date': scheme.revised_ddsc_date.strftime('%Y-%m-%d') if scheme.revised_ddsc_date else '',
        'revised_upload_ddsc_meeting_notice': scheme.revised_upload_ddsc_meeting_notice.url if scheme.revised_upload_ddsc_meeting_notice else '',
        'revised_ddsc_mom_issue_date': scheme.revised_ddsc_mom_issue_date.strftime(
            '%Y-%m-%d') if scheme.revised_ddsc_mom_issue_date else '',
        'upload_revised_ddsc_mom': scheme.upload_revised_ddsc_mom.url if scheme.upload_revised_ddsc_mom else '',
        'approval_status': scheme.approval_status,
        'aa_date': scheme.aa_date.strftime('%Y-%m-%d') if scheme.aa_date else '',
        'upload_aa': scheme.upload_aa.url if scheme.upload_aa else '',
        'tendered_date': scheme.tendered_date.strftime('%Y-%m-%d') if scheme.tendered_date else '',
        'award_date': scheme.award_date.strftime('%Y-%m-%d') if scheme.award_date else '',
        'company_name': scheme.company_name,
    }
    progress_data = list(PhysicalProgress.objects.filter(scheme=scheme_id).values().order_by('-physical_progress_date'))
    final_data = {'scheme_detail': data, 'progress_data': progress_data}
    return JsonResponse(final_data)
