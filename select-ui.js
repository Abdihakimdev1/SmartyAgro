/* ============================================================
   Smarty Agro - modern dropdown (option input) enhancer
   Keeps the real <select> in the DOM (value, onchange, .value = ...
   all keep working) and draws a modern dropdown on top of it.
   ============================================================ */
(function () {
    'use strict';

    const valDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    const idxDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'selectedIndex');
    let active = null; // currently open dropdown

    function closeActive() { if (active) active.close(); }

    function enhance(sel) {
        if (sel.dataset.cs || sel.multiple || sel.size > 1) return;
        sel.dataset.cs = '1';

        const wrap = document.createElement('div');
        wrap.className = 'cs';
        sel.parentNode.insertBefore(wrap, sel);
        wrap.appendChild(sel);
        sel.classList.add('cs-native');
        sel.tabIndex = -1;
        sel.setAttribute('aria-hidden', 'true');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cs-btn';
        btn.setAttribute('aria-haspopup', 'listbox');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span class="cs-label"></span><i class="ph-bold ph-caret-down cs-caret"></i>';
        wrap.appendChild(btn);
        const label = btn.querySelector('.cs-label');

        const menu = document.createElement('div');
        menu.className = 'cs-menu';
        menu.setAttribute('role', 'listbox');
        if (sel.closest('.auth-container')) menu.classList.add('cs-light');

        let focusIdx = -1;

        function sync() {
            const o = sel.options[idxDesc.get.call(sel)];
            label.textContent = o ? o.text : '';
            label.classList.toggle('cs-placeholder', !o || o.value === '');
            btn.disabled = sel.disabled;
            wrap.classList.toggle('cs-disabled', sel.disabled);
        }

        function build() {
            menu.innerHTML = '';
            const cur = idxDesc.get.call(sel);
            Array.from(sel.options).forEach((o, i) => {
                const item = document.createElement('div');
                item.className = 'cs-opt' + (i === cur ? ' selected' : '') + (o.disabled ? ' disabled' : '');
                item.setAttribute('role', 'option');
                item.dataset.i = i;
                item.innerHTML = '<span></span><i class="ph-bold ph-check"></i>';
                item.firstChild.textContent = o.text;
                if (!o.disabled) {
                    item.addEventListener('mousedown', e => e.preventDefault());
                    item.addEventListener('click', () => choose(i));
                }
                menu.appendChild(item);
            });
        }

        function choose(i) {
            const changed = idxDesc.get.call(sel) !== i;
            idxDesc.set.call(sel, i);
            sync();
            close();
            btn.focus();
            if (changed) {
                sel.dispatchEvent(new Event('input', { bubbles: true }));
                sel.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }

        function highlight(i) {
            const items = menu.querySelectorAll('.cs-opt');
            if (!items.length) return;
            focusIdx = Math.max(0, Math.min(items.length - 1, i));
            items.forEach((el, k) => el.classList.toggle('focus', k === focusIdx));
            items[focusIdx].scrollIntoView({ block: 'nearest' });
        }

        function place() {
            const r = btn.getBoundingClientRect();
            const vh = window.innerHeight;
            const below = vh - r.bottom - 12;
            const above = r.top - 12;
            const want = Math.min(menu.scrollHeight + 12, 280);
            const up = below < want && above > below;
            menu.style.left = r.left + 'px';
            menu.style.width = r.width + 'px';
            menu.style.maxHeight = Math.max(120, Math.min(280, up ? above : below)) + 'px';
            if (up) { menu.style.top = 'auto'; menu.style.bottom = (vh - r.top + 6) + 'px'; }
            else { menu.style.bottom = 'auto'; menu.style.top = (r.bottom + 6) + 'px'; }
        }

        function open() {
            if (sel.disabled || wrap.classList.contains('open')) return;
            closeActive();
            build();
            document.body.appendChild(menu);
            wrap.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
            place();
            requestAnimationFrame(() => menu.classList.add('show'));
            highlight(idxDesc.get.call(sel));
            active = api;
        }

        function close() {
            if (!wrap.classList.contains('open')) return;
            wrap.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            menu.classList.remove('show');
            setTimeout(() => { if (!wrap.classList.contains('open') && menu.parentNode) menu.remove(); }, 160);
            if (active === api) active = null;
        }

        const api = { close, place };

        btn.addEventListener('click', () => (wrap.classList.contains('open') ? close() : open()));
        btn.addEventListener('keydown', e => {
            const isOpen = wrap.classList.contains('open');
            if (e.key === 'Escape' && isOpen) { e.preventDefault(); close(); return; }
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (!isOpen) open();
                else highlight(focusIdx + (e.key === 'ArrowDown' ? 1 : -1));
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!isOpen) open();
                else if (focusIdx >= 0) choose(focusIdx);
            } else if (e.key === 'Tab') { close(); }
        });

        // label click / programmatic focus lands on the visible button
        sel.addEventListener('focus', () => btn.focus());

        // keep the visible label in sync when code changes the select
        Object.defineProperty(sel, 'value', {
            configurable: true,
            get() { return valDesc.get.call(this); },
            set(v) { valDesc.set.call(this, v); sync(); }
        });
        Object.defineProperty(sel, 'selectedIndex', {
            configurable: true,
            get() { return idxDesc.get.call(this); },
            set(v) { idxDesc.set.call(this, v); sync(); }
        });
        new MutationObserver(() => { sync(); if (wrap.classList.contains('open')) build(); })
            .observe(sel, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
        sel.addEventListener('change', sync);

        sync();
    }

    function enhanceAll(root) {
        (root.querySelectorAll ? root.querySelectorAll('select') : []).forEach(enhance);
    }

    document.addEventListener('mousedown', e => {
        if (active && !e.target.closest('.cs-menu') && !e.target.closest('.cs-btn')) closeActive();
    });
    window.addEventListener('resize', closeActive);
    window.addEventListener('scroll', e => {
        if (active && !(e.target.closest && e.target.closest('.cs-menu'))) closeActive();
    }, true);

    function init() {
        enhanceAll(document);
        new MutationObserver(muts => {
            muts.forEach(m => m.addedNodes.forEach(n => {
                if (n.nodeType !== 1) return;
                if (n.tagName === 'SELECT') enhance(n); else enhanceAll(n);
            }));
        }).observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
