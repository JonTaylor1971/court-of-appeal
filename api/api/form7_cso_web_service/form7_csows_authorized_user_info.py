import logging

from api.models import User
from .form7_csows_extention_caller_base import Form7CsowsExtentionCallerBase

logger = logging.getLogger(__name__)



class Form7AuthorizedUserInfo:


    def __init__(self):
        Form7CsowsExtentionCallerBase.__init__(self)

        
    def get_authorized_user_info(self, u_id, auth_id):

        try:
            user = User.objects.get(universal_id=u_id, authorization_id=auth_id)           

            info = self.client.service.isAuthorizedUser(u_id)
            user.account_id=info['accountId']
            user.client_id=info['clientId']
            user.save()

        except Exception as ex:
            logger.error("ERROR: updating account_id and client_id %s", ex)






    
    