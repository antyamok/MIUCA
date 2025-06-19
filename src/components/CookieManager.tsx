import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, Settings, X, Check } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieManager: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Toujours activé
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const savedPreferences = localStorage.getItem('miuca-cookie-preferences');
    if (!savedPreferences) {
      // Délai pour laisser le temps à la page de se charger
      setTimeout(() => setShowBanner(true), 2000);
    } else {
      const parsed = JSON.parse(savedPreferences);
      setPreferences(parsed);
      // Charger Google Analytics si accepté
      if (parsed.analytics) {
        loadGoogleAnalytics();
      }
    }
  }, []);

  const loadGoogleAnalytics = () => {
    // Charger Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-3HWTKHBJPK';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-3HWTKHBJPK', {
        anonymize_ip: true,
        cookie_flags: 'SameSite=Strict;Secure'
      });
    `;
    document.head.appendChild(script2);
  };

  const savePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem('miuca-cookie-preferences', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    
    // Charger Google Analytics si accepté
    if (newPreferences.analytics && !preferences.analytics) {
      loadGoogleAnalytics();
    }
    
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const acceptNecessary = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handlePreferenceChange = (type: keyof CookiePreferences, value: boolean) => {
    if (type === 'necessary') return; // Les cookies nécessaires ne peuvent pas être désactivés
    setPreferences(prev => ({ ...prev, [type]: value }));
  };

  return (
    <>
      {/* Banner principal */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <div className="max-w-6xl mx-auto">
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-sage/10 rounded-full">
                    <Cookie className="h-6 w-6 text-sage" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      🍪 Nous respectons votre vie privée
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Nous utilisons des cookies pour améliorer votre expérience sur notre site, 
                      analyser le trafic et personnaliser le contenu. Vous pouvez choisir quels 
                      cookies accepter.
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={acceptAll}
                        className="px-6 py-2 bg-sage text-white rounded-full hover:bg-sage/90 transition-colors duration-300 text-sm font-medium"
                      >
                        <Check className="h-4 w-4 inline mr-2" />
                        Tout accepter
                      </button>
                      
                      <button
                        onClick={acceptNecessary}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-300 text-sm font-medium"
                      >
                        Nécessaires uniquement
                      </button>
                      
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-6 py-2 text-sage hover:text-sage/80 transition-colors duration-300 text-sm font-medium flex items-center"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Personnaliser
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowBanner(false)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de paramètres détaillés */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sage/10 rounded-full">
                      <Shield className="h-6 w-6 text-sage" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Paramètres des cookies
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-gray-600 text-sm">
                  Gérez vos préférences de cookies. Vous pouvez modifier ces paramètres à tout moment.
                </p>

                {/* Cookies nécessaires */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Cookies nécessaires</h3>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">Toujours activé</span>
                      <div className="w-10 h-6 bg-sage rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Ces cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés.
                  </p>
                </div>

                {/* Cookies analytiques */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Cookies analytiques</h3>
                    <button
                      onClick={() => handlePreferenceChange('analytics', !preferences.analytics)}
                      className={`w-10 h-6 rounded-full flex items-center transition-colors duration-300 ${
                        preferences.analytics ? 'bg-sage justify-end' : 'bg-gray-300 justify-start'
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Ces cookies nous aident à comprendre comment vous utilisez notre site pour l'améliorer.
                    Données anonymisées via Google Analytics.
                  </p>
                </div>

                {/* Cookies marketing */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Cookies marketing</h3>
                    <button
                      onClick={() => handlePreferenceChange('marketing', !preferences.marketing)}
                      className={`w-10 h-6 rounded-full flex items-center transition-colors duration-300 ${
                        preferences.marketing ? 'bg-sage justify-end' : 'bg-gray-300 justify-start'
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Ces cookies sont utilisés pour vous proposer des publicités pertinentes sur d'autres sites.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => savePreferences(preferences)}
                  className="flex-1 px-6 py-3 bg-sage text-white rounded-full hover:bg-sage/90 transition-colors duration-300 font-medium"
                >
                  Enregistrer les préférences
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors duration-300 font-medium"
                >
                  Tout accepter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton flottant pour rouvrir les paramètres */}
      {!showBanner && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setShowSettings(true)}
          className="fixed bottom-4 left-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 z-40"
          title="Paramètres des cookies"
        >
          <Cookie className="h-5 w-5 text-sage" />
        </motion.button>
      )}
    </>
  );
};

export default CookieManager;