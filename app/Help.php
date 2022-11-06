<?php

namespace App;

class Help
{
    static public function isCentralDomainsReferrer()
    {
        $referrerDomain = parse_url(request()->server('HTTP_REFERER'), PHP_URL_HOST);
        $referrerDomain = str_replace('www.', '', $referrerDomain);

        return in_array($referrerDomain, config('tenancy.central_domains'));
    }
}
